﻿var hP;
var stepNumber = 0;
var sum = 0;
var _fullscreen = false;
var _title = "";
var _branding = "";
var menuMarkUp = "";
var _nodes = new Array();
var prevFolder;

function Player(xml)
{
    //load some script dynamically
    $.getScript("script/MultipleChoiceSingleSelect.js");

    //load a style sheet dynamically
    if (document.createStyleSheet) 
    {
      document.createStyleSheet("assets/styles/doilayout.css");
    }
    else 
    {
       $('head').append('<link rel="stylesheet" href="assets/styles/doilayout.css" type="text/css" />');
    }
    this.name = xml.name;
    parseXML(xml);
    buildInterface(xml);
	//assignKeyListeners();
	handleCourse(_nodes[0]);

}

function buildInterface(xml) {

    //build title bar
    buildTitleBar().appendTo('#player');

    var loadAnim = $('<div id="loadAnimation"></div>');
    loadAnim.appendTo("#player");

    var contentBox = $('<div id="mainContent"></div>');
    contentBox.appendTo("#player");

    //Commented this out cuz it was f-ing with the interaction screens!!! 8/29/12
//    $("#mainContent").bind("click", handlePlayerFocus);
//    $("#mainContent object").bind("click", handlePlayerFocus);
//    $("#mainContent myFrame").bind("click", handlePlayerFocus);

    var dialog = $('<div id="dialog"></div>');
    dialog.appendTo("#mainContent");
    dialog.dialog({
        autoOpen: false,
        title: 'Help',
        overlay: { opacity: 0.7, background: "#FFCC00" }
    });

   


    var helpMsg = "ICE Media Player v. 1.0<br/> September 2012 <br/><br/>To report a technical problem, please contact Kirby Crider at Windwalker Corporation by e-mail at kirby.crider@windwalker.com.";
    helpMsg += "<br/><br/>We appreciate your feedback!";
    $('<p>').html(helpMsg).appendTo("#dialog");

    //build tool bar
    buildToolBar().appendTo("#player");


 //   $('#systemControlContainer > div, #infoButton, #fullScreenButton, #previousButton, #nextButton').hover(
//					function () { $(this).addClass('ui-state-hover'); },
//					function () { $(this).removeClass('ui-state-hover'); }
//				);





    sum = getScreenHeightMinusPlayerBars();
    hP = $(window).height() - sum;

    $(window).resize(function () {

        if (!_fullscreen) {
            sum = getScreenHeightMinusPlayerBars();
            hP = $("#mainContent").height() - sum;
            $("#mainContent object").attr("height", hP);
            $("#mainContent myFrame").attr("height", hP);
			
        }
        else {
            hP = $("#mainContent").height();
            $("#mainContent object").attr("height", $(window).height());
            $("#mainContent myFrame").attr("height", $(window).height());
			
        }
		$("#infoPanel").css("height",  $(window).height() - 60);

    });


    // $("#mainContent").load('dummy.htm');
    $.throbberShow({ image: "media/bar_loader.gif", parent: "#loadAnimation" });



    //$('#mainContent'). { $.throbber.show({ overlay: false }) }, $.throbber.hide);

}

function buildTitleBar() {
    var tB = $('<div id="titleBar" class="ICESystemBar" ></div>');

    $('<div id="branding">').html('<img src="media/' + _branding + '"/>').appendTo(tB);
   var modTitle =  $('<div id="moduleTitle">' + _title + '</div>').css('textShadow', '#6374AB 4px 4px 6px').appendTo(tB);
  
    var sT = $('<div id="systemControlContainer"></div>');
    var cB = $('<div id="closeButton" title="Link to Close Player" tabindex="2" class="systemClose" title="close"></div>');
    var hB = $('<div id="helpMenuButton"  title="Link to Help Menu" tabindex="1" class="systemHelp" title="help"></div>');


    hB.keypress(function (e)
    {
        handleKeyboardInputOnItem(e);
    });
    cB.keypress(function (e)
    {
        handleKeyboardInputOnItem(e);
    });

  
    
    hB.click(handleHelpClick);
    cB.click(handlePlayerTerminate);

    cB.appendTo(sT);
    hB.appendTo(sT);
    sT.appendTo(tB);

   
    return tB;
}
function handleKeyboardInputOnItem(e)
{
    //alert(e.target.title);
    switch (e.target.id) 
    {
        case "closeButton":
            if (e.keyCode == 13)
            {
                handlePlayerTerminate();
            }
            break;

        case "infoButton":
            if (e.keyCode == 13) {
                handleInfo();
            }
            break;

        case "helpMenuButton":
            if (e.keyCode == 13) 
            {
                handleHelpClick();
            }
            break;

        case "nextButton":
            if (e.keyCode == 13) {
                playNextScene();
            }
            break;

        case "prevButton":
            if (e.keyCode == 13) {
                playPrevScene();
            }
            break;

        default:
            
            break;
    }
}
function handleHelpClick()
{
    $("#dialog").dialog('open');
    // prevent the default action, e.g., following a link
    return false;
}
function buildToolBar() 
{
    var toolB = $('<div id="toolBar" class="ICEToolBar"></div>');
   
    var iB = $('<div id="infoButton" title="Toggle Information Panel" tabindex="3" class="toolInfo" title="info"></div>');
    //var fB = $('<div id="fullScreenButton" class="ui-state-default ui-corner-all" title="full screen"></div>');
	
	 iB.appendTo(toolB);

	 var mnc = $('<div id="middleNavigationConsole" ></div>');
	
	//class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"
	var prev = $('<div id="previousButton" title="Go To Previous Slide" tabindex="4" class="toolPrevious" title="previous"></div>');
	var progressContainer = $('<div id="progressContainer"></div>');

	var progressText = $('<div id="pText"></div>');
	progressText.appendTo(progressContainer);

	//var progressBar = $('<div id="pBG"></div>');
//	progressBar.appendTo(progressContainer);
//
//	var progressFill = $('<div id="pFill"></div>');
//	progressFill.appendTo(progressBar);

	var next = $('<div id="nextButton" title="Go To Next Slide" tabindex="5" class="toolNext" title="next"></div>');
	
	next.appendTo(mnc);
	progressContainer.appendTo(mnc);
	prev.appendTo(mnc);
    mnc.appendTo(toolB);
  //fB.appendTo(toolB);

	//Assign Key Event handlers for keyboard and tab/accessibility navigation:
    iB.keypress(function (e)
    {
        handleKeyboardInputOnItem(e);
    });
    next.keypress(function (e)
    {
        handleKeyboardInputOnItem(e);
    }); 
    prev.keypress(function (e)
	{
	    handleKeyboardInputOnItem(e);
	});

    iB.click(handleInfo);
	next.click(playNextScene);
	prev.click(playPrevScene);
   //fB.click(handleFullScreen);


   
    //var topBarHeight = $("#titleBar").height();
    var diff = $(window).width()/2 - 360/2;
    //alert(diff);
   // mnc.css({"left":0});

    return toolB;
}
function handleInfo() {

        if ($("#infoPanel").length > 0) 
        {
            $("#infoPanel").toggle();
        }
        else 
        {
			 $("#infoPanel").toggle();
            var dp = $('<div id="infoPanel"></div>');
            dp.appendTo("#player");
			
          /*  var htmlString = "<ul id='navigation'>";
            htmlString += "<li><a href='http://www.dynamicdrive.com'>Item 1</a><ul><li><a href='http://www.dynamicdrive.com'>Item 1.0</a>";
            htmlString += "<ul><li><a href='index.html'>Item 1.0.0</a></li></ul></li></ul></li></ul>";
		  */
		  // accordion.append('<div><h3><a href="#">Menu</a></h3><div><ul id="navigation">' + menuMarkUp + '</ul></div></div>');
		  // $('<div>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</div>').('#infoPanel');
		   // alert(menuMarkUp);
		  // accordion.append('<div><h3><a href="#">Third</a></h3><div>Nam dui erat, auctor a, dignissim quis.</div></div>');
		  // accordion.appendTo(dp);

          //  $('<div><h3 id="infoHeader" class="ui-accordion-header ui-helper-reset ui-state-default ui-corner-top">Information Panel</h3></div>').appendTo("#infoPanel");

           var infoPanelBar = $('<div id="infoPanelBar">');
           var closeInfoButton = $('<div id="closeInfo">');
           var menuBtn = $('<div id="menubtn">');
           var resourcesBtn = $('<div id="resources">');

           infoPanelBar.appendTo("#infoPanel");

           closeInfoButton.appendTo(infoPanelBar);
           menuBtn.appendTo(infoPanelBar);
           resourcesBtn.appendTo(infoPanelBar);


           menuBtn.addClass('menu-hover');
           //menuBtn.removeClass('menu-hover');

			//$("<div style='position:relative, z-index:5'><ul id='navigation'>" + menuMarkUp + "</ul></div>").appendTo("#infoPanel");
           var infoBody = $('<div id="infoBody">');
           var menuBody = $('<div id="menuBody">');
           var resourceBody = $('<div id="resourceBody">');
           
           infoBody.appendTo("#infoPanel");
           menuBody.appendTo(infoBody);
           resourceBody.appendTo(infoBody);


//           function () { $(this).addClass('ui-state-hover'); },
//           function () { $(this).removeClass('ui-state-hover'); }

           closeInfoButton.click(function (e)
           {
               $("#infoPanel").toggle()
           });

           menuBtn.click(function (e)
           {

               menuBtn.addClass('menu-hover');
               resourcesBtn.removeClass('resource-hover');
               menubody.css('display','block');
               resourceBody.css('display','none');
               //alert($(this).css());
               //$('.clicked').removeAttribute('style');
           });
           resourcesBtn.click(function (e)
           {
               resourcesBtn.addClass('resource-hover');
               menuBtn.removeClass('menu-hover');
               resourceBody.css('display', 'block');
               menubody.css('display', 'none');
               //alert($(this).css());
               //$('.clicked').removeAttribute('style');
           });

           $("<div style='position:relative, z-index:5'><ul id='navigation'>" + menuMarkUp + "</ul></div>").appendTo(menuBody);
            //$('<div id="infoPanelBG"></div>').appendTo("#infoPanel");
			//$("#infoPanelBG").css('opacity',1)

            var num = $(window).height() - getScreenHeightMinusPlayerBars();
            dp.css({ top: "30px", height: num });
            dp.css({ height: num });

			//$("#accordion").accordion({ header: "h3", fillSpace: true});

            $("#navigation").treeview({
                collapsed: true,
                unique: true,
                persist: "location"
            });

            $("#navigation a").click(function (e)
            {
                //alert(e.target.nodeName);  
                //alert($(this).css());
                //$('.clicked').removeAttribute('style');

                if ($(e.target).attr("id")) {
                    navigateToNode(parseInt($(e.target).attr("id")));
                }
                //$(this).animate({backgroundColor: '#0099CC', color: '#fff'}, 1000);
                return false;
                e.preventDefault();
            });
            var target = $("#" + stepNumber + "");
            target.animate({ backgroundColor: '#0099CC', color: '#fff' }, 100);
            prevFolder = target.parents().eq(2);
            if (target.parents().eq(2)) {
                target.parents().eq(2).css("display", "block");
                prevFolder = target.parents().eq(2);
                //alert($(prevFolder).attr("id"));
            }
        }
}

function navigateToNode(num)
{
	var str = "";
	for(var i=0; i < _nodes.length; i++)
	{
		str +=_nodes[i].title + "\n";
	}
	//alert(str);
	stepNumber = num;
	//alert("slide# " + num + " - " + _nodes[num].title + " : " + _nodes[num].src);
	clearDisplayList();
	handleCourse(_nodes[num]);

		
}
function getScreenHeightMinusPlayerBars() {


    var topBarHeight = $("#titleBar").height();
    var bottomBarHeight = $("#toolBar").height();
    var n = topBarHeight + bottomBarHeight
    return n;
}

function handleFullScreen() {

    // var beh = $("#titleBar").clone();
    //var teh = $("#toolBar").clone();
    // alert(_fullscreen);
    //  $("#titleBar").toggle();
    // $("#toolBar").toggle();


    var progressText = "";
    var numString = "";

    if (!_fullscreen) {

       // $("#titleBar").remove();
        //$("#toolBar").remove();
		$("#titleBar").toggle();
		$("#toolBar").toggle();
		
        var topDock = $('<div id="topDock"></div>');
        topDock.appendTo("#mainContent");

        buildTitleBar().prependTo('#topDock');
		
        topDock.mouseover(function () {
            $("#topDock > div").css({ opacity: 1.0 });

        });
        topDock.mouseout(function () {

            $("#topDock > div").css({ opacity: 0.0 });
        });

        var bottomDock = $('<div id="bottomDock"></div>');
        bottomDock.prependTo("#mainContent");

        buildToolBar().appendTo("#bottomDock");

        numString = stepNumber + 1 + '';
        progressText = "Screen " + numString + " / " + _nodes.length;
        $("#pText").html(progressText);
        $("#pFill").css({ "width": ((stepNumber + 1) / _nodes.length) * $("#pBG").width() });

        bottomDock.mouseover(function () {
            $("#bottomDock > div").css({ opacity: 1.0 });
        });
        bottomDock.mouseout(function () {
            $("#bottomDock > div").css({ opacity: 0.0 });
        });

        hP = $("#mainContent").height();
        $("#mainContent object").attr("height", $(window).height());

        $("#topDock > div").css({ opacity: 0.0 });

        _fullscreen = true;
    }

    else {
        $("#topDock").remove();
        $("#bottomDock").remove();

		$("#titleBar").toggle();
		$("#toolBar").toggle();
     
        hP = $("#mainContent").height() - getScreenHeightMinusPlayerBars();
        $("#mainContent object").attr("height", $(window).height() - getScreenHeightMinusPlayerBars());
        numString = stepNumber + 1 + '';
        progressText = "Screen " + numString + " / " + _nodes.length;
        $("#pText").html(progressText);
        $("#pFill").css({ "width": ((stepNumber + 1) / _nodes.length) * $("#pBG").width() });

        _fullscreen = false;

    }
}



function parseXML(xml) {

    _branding = $(xml).find('system > branding').text();
    _title = $(xml).find('module > title:first').text();

		
    $(xml).find('node').each(function () {

		if($(this).children('node-collection').length == 0)
		{
            var stepObject = new Object();
            stepObject.id = $(this).attr('id');
            stepObject.type = $(this).attr('type');
            stepObject.title = $(this).find('title:first').text();
            stepObject.src = $(this).find('file:first').attr('src');

            //alert(stepObject.id + ", " + stepObject.title + ", " + stepObject.title + "\n" + stepObject.src);
            _nodes.push(stepObject);
		}
    });

   var startNode = $(xml).find('node-collection:first');
    menuMarkUp = makeToc(startNode);
	//alert(tocOutput);
     //$("#list").html(tocOutput);
	//$("#list").appendTo("#player");
	
   


   
}
function assignKeyListeners() 
{

	 $(document).keyup(function (e) {
        var code = e.keyCode;
        switch (code) {
            //case 13:   
            // Perform some action when enter is placed   
            //return;    
            case 33:
            case 37:
            case 38:
                // Navigate up or Navigate left
                playPrevScene();
                break;

            case 34:
            case 39:
            case 40:
                // Navigate down  Navigate right
                playNextScene();
                break;
        }
        return false;
    });
}
function makeToc(xml)
{
    // variable to accumulate markup
    var markup = "";
    // worker function local to makeToc
    var index = -1;
    function processXml()
    {

        //var elem = $(this).find('node-collection:first');
        //$(this).children('tag_name').length > 0;			
        index++;
        if ($(this).children('node-collection:first').length > 0) {
            markup += "<li><span id='menuitem' class='folder'>" + $(this).find('title:first').text() + "</span>";
            // var anchor = "<a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a>";
            // alert($(this).find('title:first').text());
            index--;

            markup += "<ul id='navigation'>";

            $(this).find("node").each(processXml);
            markup += "</ul>";
        }
        else {
            markup += "<li><span id='menuitem'><a href='#' id=" + index + ">" + $(this).find('title:first').text() + "</a></span>";
        }
        markup += "</li>";
    }
    // call worker function on all children
    $(xml).children().each(processXml);
    return markup;
}
	

function keyListener(e) {
    var code = e.keyCode;
    switch (code) {
        //case 13:    
        // Perform some action when enter is placed    
        //return;     
        case 33:
        case 37:
        case 38:
            // Navigate up or Navigate left
            playPrevScene();
            break;

        case 34:
        case 39:
        case 40:
            // Navigate down  Navigate right
            playNextScene();
            break;
    }
}
function playNextScene() {

    if (stepNumber < _nodes.length - 1) {
        clearDisplayList();
        stepNumber++;
        handleCourse(_nodes[stepNumber]);
    }
    else {
        stepNumber = _nodes.length - 1;
    }
}
function playPrevScene() {

    if (stepNumber > 0) {
        clearDisplayList();
        stepNumber--;
        handleCourse(_nodes[stepNumber]);
    }
    else {
        stepNumber = 0;
    }
}
function clearDisplayList() {

    swfobject.removeSWF("Flash");
    $("#myFrame").remove();
}
function updateInterface() {

    var numString = stepNumber + 1 + '';
    var progressText = "Screen " + numString + " / " + _nodes.length;
    $("#pText").html(progressText);
    $("#pFill").css({ "width": ((stepNumber + 1) / _nodes.length) * $("#pBG").width() });



    if ($("#navigation")) {
        //Clear the highlights
        $("#navigation a").removeAttr('style');

        //alert("Animate  id=" + stepNumber);
        //alert($("#"+stepNumber+"").attr("id"));
        var target = $("#" + stepNumber + "");
        target.animate({ backgroundColor: '#0099CC', color: '#fff' }, 0);
        if (target.parents().eq(2)) {
            //alert($(target.parents().eq(2)).attr("id"));
            target.parents().eq(2).css("display", "block");
            //alert($(prevFolder).is($(target.parents().eq(2))));
            /* used jquery is() function to compare 2 elements 
            Note: Due to DOM reference system using arrays- the references would always
            be false as the specific reason*/
            if (!$(prevFolder).is($(target.parents().eq(2)))) {
                $(prevFolder).css("display", "none");
                prevFolder = target.parents().eq(2);
            }
        }
    }



	
}

function handleCourse(s) {
	
    updateInterface();

    var loadAnim = $('<div id="loadAnimation"></div>');
    loadAnim.appendTo("#player");
    $("#loadAnimation").css({
        position: 'absolute',
        left: ($(window).width() / 2 - 100),
        top: ($(window).height() / 2)
    });
    $.throbberShow({ image: "media/bar_loader.gif", parent: "#loadAnimation" })

    switch (s.type) {
        case "video":
            handleICEVideo("data/xml/" + s.src);
            break;

        case "evaluation":
            handleICEEvaluation("data/xml/" + s.src);
            break; 
        
        default:
            loadDefault(s.src);
            break;

    }
}

function handleICEEvaluation(str)
{
   //alert(str);
    $.ajax({
        url: str,
        dataType: ($.browser.msie) ? "text" : "xml",
        success: function (data)
        {
            var xml;
            if (typeof data == "string") {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = false;
                xml.loadXML(data);
            }
            else {
                xml = data;
            }


            var evalXML = $(xml).find('evaluation');
            var evalObject = new Object();
            evalObject.evalType = evalXML.attr('evalType');
            evalObject.titleText = evalXML.find('titleText').text();
            evalObject.questionText = evalXML.find('questionText').text();
            evalObject.instructionText = evalXML.find('instructionText').text();

            if (evalXML.children('remediation').length != 0) {
                evalObject.remediation = new Object();
                var remFile = evalXML.find('remediation > file');
                evalObject.remediation.file = remFile.attr('href');
                evalObject.remediation.windowOptions = remFile.attr('windowOptions');
                evalObject.remediation.linkText = evalXML.find('remediation > linkText').text();
                //alert(evalObject.remediation.windowOptions);

            }

            evalObject.feedback = new Array();
            evalXML.find('feedbackText').each(function ()
            {
                var feedbackObject = new Object();
                feedbackObject.valueID = $(this).attr('valueID');
                feedbackObject.text = $(this).text();
                //alert(feedbackObject.valueID + ", " + feedbackObject.text + "\n");
                evalObject.feedback.push(feedbackObject);

            });

            evalObject.choices = new Array();
            evalXML.find('choice').each(function ()
            {
                var choiceObject = new Object();
                choiceObject.id = $(this).attr('id');
                choiceObject.valueID = $(this).attr('valueID');
                choiceObject.text = $(this).find('text:first').text();
                // alert(choiceObject.id + ", " + choiceObject.valueID + ", " + choiceObject.text + "\n");
                evalObject.choices.push(choiceObject);

            });

            evalObject.values = new Array();
            evalXML.find('value').each(function ()
            {
                var valueObject = new Object();
                valueObject.id = $(this).attr('id');
                valueObject.text = $(this).text();
                // alert(valueObject.id + ", " + valueObject.text + "\n");
                evalObject.values.push(valueObject);

            });


            switch (evalObject.evalType) {
                case "multipleChoiceSingleSelect":
                    buildMultipleChoiceSingleSelect(evalObject);
                    break;

                default:
                    break;
            }
        }

    });
}

function handleICEVideo(str) {
    //alert(str);
    $.ajax({
        url: str,
        dataType: ($.browser.msie) ? "text" : "xml",
        success: function (data)
        {
            var xml;
            if (typeof data == "string") {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = false;
                xml.loadXML(data);
            }
            else {
                xml = data;
            }
            if ($(xml).find('file').attr('src') != "") {
               
                loadFlashVideo($(xml).find('file').attr('src'));
            }
        }

    });
}

function loadFlashVideo(str) {
    var flashvars =
			{
			    src: str,
			    /* autoPlay: "false",
			    verbose: true,
			    controlBarAutoHide: "false",
			    controlBarPosition: "bottom",*/
			    poster: "images/poster.png"

			};

    var params = {
        menu: "false",
        scale: "exactFit",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        wmode: "transparent",
        bgcolor: "#111111",
        swfliveconnect: true

    };
    var attributes = {
        id: "Flash",
        name: "Flash",
        swfliveconnect: true
    };
    if ($("#mainContent object")) {
        // $("#mainContent object").remove();
       
        var load = $('<div id="contentContainer"></div>');
        load.appendTo("#mainContent");
    }

    //setTimeout(function () {
        swfobject.embedSWF("ICEMediaPlayer.swf", "contentContainer", "100%", hP, "10.0.0", "expressInstall.swf", flashvars, params, attributes,
           function () {
               setTimeout(function () {
                   $("#loadAnimation").remove();
               }, 500);
               // $.throbber.hide();
           }

            );
   // }, 1000);


}

function loadDefault(item) {
    var pos = item.lastIndexOf(".");
    var fileExtension = item.substr(pos);
    switch (fileExtension) {
        case ".png":
        case ".jpg":
        case ".gif":
            $("#mainContent").html('<img src=' + item + ' width="' + $(window).width() + '" height="' + $(window).height() + '"/>').appendTo('#body');
            break;

        case ".flv":
        case ".f4v":
            loadFlashVideo(item);
            break;

        case ".swf":
            var flashvars =
			{
			};

            var params = {
                menu: "false",
                scale: "exactFit",
                allowFullscreen: "false",
                allowScriptAccess: "always",
                wmode: "transparent",
                bgcolor: "#111111",
                swfliveconnect: true

            };
            var attributes = {
                id: "Flash",
                name: "Flash",
                swfliveconnect: true
            };
            $("#mainContent").html("");
            if ($("#mainContent object")) {
                // $("#mainContent object").remove();

                var load = $('<div id="contentContainer"></div>');
               
                load.appendTo("#mainContent");
               
            }
           // setTimeout(function () {
            swfobject.embedSWF(item, "contentContainer", "100%", hP, "10.0.0", "expressInstall.swf", flashvars, params, attributes,
           function () {
               $("#loadAnimation").remove();
               // $.throbber.hide();
           }

           );
           // }, 500);
           break;

       case ".htm":
       case ".html":
           var iframe = $('<iframe />', {
               name: 'myFrame',
               id: 'myFrame',
               frameBorder: 0,
               width: "100%",
               height: hP,
               allowtransparency: "true",
               src: item
           });

           $("#mainContent").html(iframe);
           var contentImages = $("#mainContent iframe").load(function ()
           {
               //alert("iframe loaded");
               $("#loadAnimation").remove();
           });


           // iframe.bind('click', handlePlayerFocus);
           /* iframe.load(function () {
           var frameBody = iframe.contents().find('html');
           frameBody.click(handlePlayerFocus);
           });*/

           break;

        default:
            alert("the file type is not a a recognized format! " + item);
            break;
    }
}


function handlePlayerFocus () {
   // alert("WEEHOOO");
    //$('#player').focus();
   /* setTimeout(function () 
    {
        $('#player').focus();
    }, 500);

*/

    return false;
}
