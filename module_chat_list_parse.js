/* This module is responsible to go through the list of chats (with unique users) and find out
   the chats with an unread message. It should then open the unread chats on by one, after which
   the message reply module will start its work.

   DONE:
   -> Read through the message list
   -> Open all the chats with unread messages

   PENDING:
   (Not done as is useless to do unless we can actually reply to a message)
   -> Integrate with message reply module
   -> Cycle through the chat list
   -> Poll for new messages, once the current list has no unread messages
   -> IGNORE group chats
*/



//Declare variables
var scrollPane = jQuery(".pane-body.pane-list-body");
var blockHeight = jQuery(".infinite-list-item").height();
var blockCount = jQuery(".infinite-list-viewport").children().length;
var totalHeight = jQuery(".infinite-list-viewport").height();
var scrollHeight = blockHeight * (blockCount + 1);
var numberOfScrolls = totalHeight / scrollHeight;
console.log("n = " + numberOfScrolls);
var lastScrollPos = scrollPane.scrollTop();
//sh - 800
//st - var the current pos 
//Scrolling function
function scrollFunction() {
    scrollPane.scrollTop(scrollPane.scrollTop() + scrollHeight);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var count = 0;
var stack = [];

//Click on unread msg
function checkUnread() {
    jQuery('.infinite-list-viewport').children().each(function() {
        if (jQuery(this).children().hasClass("chat unread")) {
            console.log("There is an unread message by " + jQuery(this).children().children(".chat-body").children().children().children().html());
            jQuery(this).children().click();
        }
    });
    //console.log(jQuery(this).children().children(".chat-body").children().children().children().html())
    scrollFunction();
    //sleep(100); jQuery('.infinite-list-viewport').children().children(".chat-status span").html()
}



var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// The node to be monitored
var target = document.getElementById("pane-side");

// Create an observer instance
var observer = new MutationObserver(function(mutations) {
    if (count < parseInt(numberOfScrolls)) {
        console.log("scrolls are less " + count);
        count++;
        checkUnread();
    } else {
        console.log("scrolls are more " + numberOfScrolls);
        scrollPane.scrollTop(0);
        observer.disconnect();
    }
});

// Configuration of the observer:
var config = {
    subtree: true,
    attributes: true
};

// Pass in the target node, as well as the observer options
observer.observe(target, config);
scrollPane.scrollTop(scrollPane.scrollTop() + 1);