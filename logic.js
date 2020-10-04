let btn = document.getElementById('delete-button');
let log = chrome.extension.getBackgroundPage().console.log

const getDomainName = function (url) {
    return new URL(url).hostname.split(".")[1];
}

btn.onclick = function (element) {
    const txt = document.getElementById('url-to-delete').value

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date()

    chrome.history.search({
        text: txt, startTime: startDate.getTime(), endTime: endDate.getTime(),
    }, function (list) {
        log("entered domain => ", txt)
        const okList = list.filter(function (element) {
            return getDomainName(element.url) == txt;
        })

        renderList(okList)

        log("found list => ", okList)
        okList.forEach(function (element) {
            chrome.history.deleteUrl({ url: element.url }, function () {
                log("deleted ", element.url)
            })
        })
    })
};

const cleanList = function (className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) elements[0].remove();
}

const renderList = function (listData) {
    const className = "history-list"
    // remove previous list
    cleanList(className)

    let naughty = document.getElementById("naughty")

    if (listData.length > 0) {
        naughty.innerHTML = "Oh you have been very naughty!, found these and deleting ...."
    } else {
        naughty.innerHTML = "you are clean!!"
    }

    // Make a container element for the list
    let listContainer = document.createElement('div');
    listContainer.className = className

    // Make the list
    let listElement = document.createElement('ul');


    // Add it to the page
    document.getElementsByTagName('body')[0].appendChild(listContainer);
    listContainer.appendChild(listElement);

    listData.forEach(function (element) {
        // create an item for each one
        listItem = document.createElement('li');

        // Add the item text
        listItem.innerHTML = element.title;

        // Add listItem to the listElement
        listElement.appendChild(listItem);
    });
}