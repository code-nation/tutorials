var StagedDonations = StagedDonations || {};

$(document).ready(function(){

  (function(){

    this.updateContainerHeight = function(height) {
      $('.progress-stages').animate({'min-height':height},300);
    }

    this.updateProgressIndicator = function(indicator, direction) {
      var current = indicator.find('.active');
      var next = current.next();
      var previous = current.prev();
      if (direction && current.next().length) { // direction = 0 if going backwards, 1 if going forwards
        current.addClass('completed').find('.stage-count-inner').addClass('icon-tick');
        current.removeClass('active');
        next.addClass('active');
        next.addClass('seen');
      } else if (!direction && current.prev().length) {
        current.removeClass('active');
        previous.addClass('active');
      } else {
        // do nothing
      }
    }

    this.updateProgressStages = function(stages, direction) {
      var ns = this;
      var current = stages.find('.active');
      var next = current.next();
      var previous = current.prev();
      if (direction && current.next().length) { // direction = 0 if going backwards, 1 if going forwards
        current.hide('slide',{direction:'left',easing:'easeInBack'},300,function(){
          $(this).removeClass('active');
          current.next().show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
        });
      } else if (!direction && current.prev().length) {
        current.hide('slide',{direction:'left',easing:'easeInBack'},function(){$(this).removeClass('active');
          current.prev().show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
        });
      } else {
        // do nothing
      }
    }

   this.triggerAlert = function(alertMessage, element) {
      element.closest(".form-group").addClass('has-error');
      element.before("<label class='control-label custom-error text-left' style='text-align: left;'>" + alertMessage + "</label>");
      // var message = '<div class="form-error">'+alertMessage+'</div>';
      //insertBefore.before(message);
    };

    this.removeAlerts = function() {
      $('.has-error').each(function(){
        $(this).removeClass('has-error');
        $(this).find('label.custom-error').remove();
      });
      $('#auto_address .form-group').removeClass('has-error');
      $('#address-error-msg').hide();
    };

    this.validateEmail = function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    this.validateDonations = function(currentStage) {
      var donationAmount = $('#donation_amount_other').val() == "" ? 0 :  parseFloat($('#donation_amount_other').val());
      switch (currentStage) {

        case "1":
          if ((donationAmount < 0.5) && ($('.progress-stage input[type="radio"]:checked').length == 0)) {
            this.triggerAlert("Invalid donation amount",$('#donation_amount_other'));
            return false;
          } else {
            return true;
          }
          break;

        case "2":
          var answer = true;

          var validatedEmail = this.validateEmail($('#donation_email').val());
          if (!$('#donation_billing_address_address1').val()) {
            this.triggerAlert("Address1 can't be blank",$('#donation_billing_address_address1'));
            answer = false;
          }
          if (!$('#donation_billing_address_city').val()) {
            this.triggerAlert("City can't be blank",$('#donation_billing_address_city'));
            answer = false;
          }
          if (!$('#donation_billing_address_phone_number').val()) {
            this.triggerAlert("Phone number can't be blank",$('#donation_billing_address_phone_number'));
            answer = false;
          }
          if (!$('#donation_first_name').val()) {
            this.triggerAlert("You must supply your first name.",$('#donation_first_name'));
            answer = false;
          }
          if (!$('#donation_last_name').val()) {
            this.triggerAlert("You must supply your last name.",$('#donation_last_name'));
            answer = false;
          }
          if (!validatedEmail) {
            this.triggerAlert("Email address not valid",$('#donation_email'));
            answer = false;
          }
          return answer;
          break;

        default:
          return true;
      }
    }
  }).apply(StagedDonations);

  if ($('.progress-indicator-stages').length) {

    var progressIndicator = $('.progress-indicator-stages');
    var progressStages = $('.progress-stages');

    // Stage indicator click functions
    $('.progress-indicator-stages .stage-count').each(function(){$(this).click(function(event){
      event.preventDefault();
      if (!$(this).parent().hasClass('active')) {
        if ($(this).parent().hasClass('completed') || $(this).parent().hasClass('seen')) {
          var clickedIndicatorStageClass = $.grep($(this).parent().attr("class").split(" "), function(v, i){
            return v.indexOf('stage-') === 0;
          }).join();
          var currentActiveIndicator = progressIndicator.find('.active');
          var desiredProgressStage = progressStages.children('.'+clickedIndicatorStageClass);
          var currentActiveStage = progressStages.find('.active');
          currentActiveIndicator.removeClass('active');
          $(this).parent().addClass('active');
          currentActiveStage.hide('slide',{direction:'left',easing:'easeInBack'},300,function(){
            $(this).removeClass('active');
            desiredProgressStage.show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
          });
        }
      }
    });});

    // Prev and next stage actions on form
    $('.progress-stage-button-next').each(function(){$(this).click(function(event){
      event.preventDefault();
      StagedDonations.removeAlerts();
      var currentStage = $('.progress-stage.active').attr('data-stageid');
      var isValid = StagedDonations.validateDonations(currentStage);
      if (isValid) {
        StagedDonations.updateProgressIndicator(progressIndicator, 1);
        StagedDonations.updateProgressStages(progressStages, 1);
      } else {
        progressIndicator.find('.active').removeClass('completed').find('.stage-count-inner').removeClass('icon-tick');
        progressIndicator.find('.active').next().removeClass('seen');
      }
    });});

    $('.progress-stages .radio').each(function(){$(this).click(function(event){
      StagedDonations.updateProgressIndicator(progressIndicator, 1);
      StagedDonations.updateProgressStages(progressStages, 1);
    });});

    $('.progress-stage-button-prev').each(function(){$(this).click(function(event){
      event.preventDefault();
      StagedDonations.removeAlerts();
      StagedDonations.updateProgressIndicator(progressIndicator, 0);
      StagedDonations.updateProgressStages(progressStages, 0);
    });});

    progressStages.find('input[type="submit"]').click(function(event){
      progressIndicator.find('.active').addClass('completed').find('.stage-count-inner').addClass('icon-tick');
    });

  }

});
