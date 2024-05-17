// Sticky navigation bar  //

let navbar = $(".navbar");
$(window).scroll(function () {
    let oTop = $(".section-2").offset().top - window.innerHeight;
    if ($(window).scrollTop() > oTop) {
        navbar.addClass("sticky");
        console.log($(window).scroll);
    }
    else {
        navbar.removeClass("sticky");
    }
});


// for counter

let nCount = selector => {
    $(selector).each(function () {
        $(this)
            .animate({
                Counter: $(this).text()
            }, {
                // A string or number determining how long the animation will run.
                duration: 9000,
                // A string indicating which easing function to use for the transition.
                easing: "swing",
                /**
                 * A function to be called for each animated property of each animated element. 
                 * This function provides an opportunity to
                 *  modify the Tween object to change the value of the property before it is set.
                 */
                step: function (value) {
                    $(this).text(Math.ceil(value));
                }
            });
    });
};


// js dollar to ruppes and rupees to dollar convert continuoschange js start


function convertCurrency() {
    var elements = [document.getElementById("pricing1"), document.getElementById("pricing2"), document.getElementById("pricing3")];
    var isDollarToRupees = true;

    // Set interval to run every 1 second
    setInterval(function () {
        for (var i = 0; i < elements.length; i++) {
            var priceElement = elements[i].querySelector("h1");
            var price = parseFloat(priceElement.textContent);
            if (isDollarToRupees && priceElement.textContent.includes("$")) {
                // Convert dollar to rupees
                price = Math.floor(price * 83.51); // Round down to remove decimals
                priceElement.textContent = price + "₹";
            } else if (!isDollarToRupees && priceElement.textContent.includes("₹")) {
                // Convert rupees to dollar
                price = price / 83.51;
                priceElement.textContent = price.toFixed(2) + "$";
            }
        }
        // Toggle conversion direction
        isDollarToRupees = !isDollarToRupees;
    }, 1000); // 1000 milliseconds = 1 second
}

// Call the function when the page loads
convertCurrency();


// js dollar to ruppes and rupees to dollar convert continuoschange js end

let a = 0;
$(window).scroll(function () {
    // The .offset() method allows us to retrieve the current position of an element  relative to the document
    let oTop = $(".numbers").offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() >= oTop) {
        a++;
        nCount(".rect > h1");
    }
});
