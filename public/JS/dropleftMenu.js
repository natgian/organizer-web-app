document.addEventListener("DOMContentLoaded", function () {
    const dropleftButtons = document.querySelectorAll("[data-dropleft-button]");
    let openMenu = null; // Variable to keep track of the currently open menu

    dropleftButtons.forEach(function(button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the document

            if (openMenu && openMenu !== this.parentElement) {
                openMenu.classList.remove("active"); // Close the previously open menu
            };

            this.parentElement.classList.toggle("active");
            openMenu = this.parentElement; // Update the open menu
        });

        // Close dropleft menu when clicking outside of it
        document.addEventListener("click", function (event) {
            if (openMenu && !openMenu.contains(event.target)) {
                openMenu.classList.remove("active"); // Close the currently open menu
                openMenu = null; // Reset the open menu variable
            };
        });
    });
});

