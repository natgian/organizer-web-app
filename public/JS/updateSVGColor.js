    // Function to update the SVG color
    function updateSVGColor(color) {
      const svgIcon = document.getElementById("list-icon");
      svgIcon.querySelector("path").setAttribute("fill", color);
    }
  
    // Get all color option elements and add event listeners
    const colorOptions = document.querySelectorAll(".color-option input[type='radio']");
    colorOptions.forEach((option) => {
      option.addEventListener("change", (event) => {
        updateSVGColor(event.target.value);
      });
    });