/*  This module is used to parse the unread messages from an open chat window,
 add them to the stack of messages and one by one take necessary action for each message


 DONE:
 -> Get the list of new messages
 -> Stop at the last 'sent' message
 -> Add a (dummy) reply to the input box


 PENDING:
 -> SEND the reply back to the viewer
 (Below all cases only makes sense to do if we can actually SEND a reply to the user)
 -> Check and handle cases when the last message is image, video, audio, etc. or if it is a group chat
 -> Parse the message (Lematization/NLP) and give appropriate response
 -> Retrieve the user's name and number from the chat
 -> Integrate with Chat list parser
 */


//Global stack of unread messages - created stack as we have to reply to older messages first
var stack = [];

//This message goes through list of messages, adds the unread ones to the stack - up until the last SENT message
//The logic is that if we have SENT a message it means we have already replied to the previous queries.
function checkUnread() {

    //Get the length of the total list of messages currenty visible
    var messageLength = jQuery('.message-list').children().length;

    //Loop through all the messages - from bottom to top
    for (var i = messageLength - 1; i >= 0; i--) {
        //Get the current message
        var msg = jQuery('.message-list').children().eq(i);

        //Check if it is a message from the other person
        if (msg.children().hasClass("message-in")) {
            //Add the message to the stack
            stack.push(msg.children().children().children().eq(1).children().eq(1).text());
            //We do not do any processing on the messages here, the task is just to get the list of inbound messages
        }
        //If it is a message by us, break - as we "must have" already replied to the previous messages.
        else if (msg.children().hasClass("message-out")) {
            break;
        }
    }

    //We have recieved all the messages, it is now time to process them, and reply to the messages wherever required.
    //Processing of the inbound messages one by one 
    for (var i = 0; i <= stack.length; i++) {
        var inputMsg = stack.pop();
        console.log(inputMsg);
        //Check null on the msg
        if (inputMsg != "") {


            var inputBox = jQuery(".pane-footer.pane-chat-footer").find(".input");

            //Just to give focus to the page - not required
            jQuery('.message-list').click();

            //After 3seconds, give focus to the input box and do rest of the processing
            setTimeout(function() {

                inputBox.focus();
                var e = jQuery.Event("keydown");
                e.which = 86; // # F1 code value
                e.ctrlKey = true; // Ctrl key pressed
                inputBox.trigger(e);

                console.log("triggered ");
                /*var press = jQuery.Event("
                 keypress ");
                 press.which = 69;
                 press.keyCode = 69;
                 inputBox.trigger(press);
                 console.log("
                 triggered press ");*/

                /* ---------------TO-DO----------------- 
                 Here, we need to process the input text
                 -> Lematize the words (normalize)
                 -> Match keywords and phrases against a predefined set
                 -> Possibly to be done on a seperate gateway and only do I/o here
                 -> Based on requested keyword or phrase, give appropriate response
                 -> To match the person against the bank's DB, will need to use phone number only
                 as other data is not available over whatsapp. Alternatively will require to
                 ask the user to enter his bank details, but that could lead to unsafe operations
                 */

                //For now - Add a dummy message to the input box
                message = 'Your available balance is $500';
                sendMessage(message)
            }, 3000);



        }
    }
}

function sendMessage(message)
{
    var count = 1; //number of times to send
    var i = 0;

    var timer = setInterval( function(){
        var evt = document.createEvent("TextEvent");
        evt.initTextEvent ("textInput", true, true, window, message , 0, "en-US");  // initTextEvent(eventType, true ,true , window , Your TEXT ,0 , "en-US" )
        document.querySelector(".input-container .input").focus();							//target.focus()
        document.querySelector(".input-container .input").dispatchEvent(evt);					//target.dispatch(event)
        i++;
        if( i == count )
            clearInterval(timer);

        console.log(i + " messages sent");

        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        document.querySelector(".icon.btn-icon.icon-send").dispatchEvent(event);
    },10);
}

//Call this function once
checkUnread();