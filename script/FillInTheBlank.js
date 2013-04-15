function buildFillInTheBlank(evalObject)
{

    if ($("#mainContent")) {
       // alert(evalObject.titleText);

        $("#mainContent").html("");
        var load = $('<div id="contentWindow"></div>');
        // load.css("bacground", $("source").css("border"));

        var titleTextDiv = $('<div id="titlecontent"><h1>' + evalObject.titleText + '</h1></div>');
        var questionTextDiv = $('<div id="contentcontainer"><div id="quiz"><h2>' + evalObject.questionText + '</h2></div></div>');
        titleTextDiv.appendTo(load);
        questionTextDiv.appendTo(load);

        var form = $('<form action=\"javascript:void(0)\;\" method="post"></form>');
        var inputText = $('<textarea  id="userAnswer" name="userInput"/>');
        inputText.css("width", "90%");
        inputText.css("height", "200");
        inputText.appendTo(form);
        var br = $('<br/>');
        br.appendTo(form);
        var submitBtn = $('<input type="submit"/>');
        submitBtn.attr("value", "Submit");
         submitBtn.appendTo(form);
         submitBtn.click(function (e) {

             userSelection = $('#userAnswer').val();

             var para = $('<p>');
             if (userSelection === "") {

                 para.text("You must make a selection in order to continue!");
                 feedback.html("");
                 para.appendTo(feedback);
             }
             else {

                 para.text("Thank you for shopping");
                 feedback.html("");
                 para.appendTo(feedback);
                
                 $(document).trigger("ASSET_COMPLETE");

             }

             feedback.show();
             feedback.focus();
         });
        form.appendTo(questionTextDiv);

         var feedback = $('<div id="feedback" tabindex="1"></div>');
         feedback.appendTo(form);
         feedback.hide();
        
       
        load.appendTo("#mainContent");
    }

    
   
               setTimeout(function ()
               {
                   $("#loadAnimation").remove();
               }, 500);
          
}
