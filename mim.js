document.addEventListener("DOMContentLoaded", function() {
    const checkBtn = document.getElementById("check-btn");
    const emailInput = document.getElementById("email-input");
    const fileInput = document.getElementById("file-input"); // Field for file upload
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");
    const imagePreview = document.getElementById('image-preview');
    const imageMessage = document.getElementById('image-message');

    // Image preview when file is selected
    document.getElementById('upload-image-btn').addEventListener('click', function () {
        document.getElementById('file-input').click(); // Open file chooser
    });

    document.getElementById('file-input').addEventListener('change', function () {
        const file = this.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result;
                imagePreview.src = imageData;
                imagePreview.style.display = 'block';  // Show the image
                imageMessage.style.display = 'block'; // Show the image message
            };
            reader.readAsDataURL(file); // Read file as Data URL
        }
    });

    // Handling the "Check" button click
    checkBtn.addEventListener("click", function() {
        const text = emailInput.value.trim();
        const file = fileInput.files[0]; // Get the selected file
        resultDiv.textContent = ""; // Clear previous results
        loader.style.display = "block"; // Show loading spinner

        if (text === "" && !file) {
            resultDiv.textContent = "Please enter text or upload an image.";
            loader.style.display = "none";
            return;
        }

        // Check text for phishing
        if (text !== "") {
            checkPhishing(text);
        }

        // Check image for phishing
        if (file) {
            handleImagePhishingCheck(file); // Perform image phishing check
        }
    });

    // Function for phishing check on the text
    function checkPhishing(text) {
        let phishingScore = 0;

        // Updated phishing keywords
        const phishingKeywords = [
            "ваш обліковий запис", 
            "підтвердження", 
            "блоковано", 
            "встановіть пароль", 
            "аккаунт заблоковано", 
            "відновити доступ",
            "незвичайна активність",
            "підтвердження особи",
            "несанкціонований доступ",
            "виконати дію протягом",
            "24 години"
        ];
        
        phishingKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                phishingScore += 25; // Add points for found keywords
            }
        });

        // Checking for links
        const phishingLinksPattern = /https?:\/\/[^\s]+/g;
        const foundLinks = text.match(phishingLinksPattern);
        if (foundLinks) {
            phishingScore += foundLinks.length * 10; // Add points for found links
        }

        // Checking for suspicious domains
        const suspiciousDomains = ["paypal.com", "fakeemail.com", "example.com"];
        suspiciousDomains.forEach(domain => {
            if (text.includes(domain)) {
                phishingScore += 50; // Add points for suspicious domain
            }
        });

        displayPhishingResult(phishingScore);
    }

    // Function to handle image phishing check (simulating with random %)
    function handleImagePhishingCheck(file) {
        // Simulating a delay before showing the result
        setTimeout(function() {
            const randomPercentage = Math.floor(Math.random() * 100) + 1; // Random percentage from 1 to 100
            resultDiv.textContent = `The phishing likelihood for this image is: ${randomPercentage}%`;
            loader.style.display = "none"; // Hide the loader after the result
        }, 2000); // Simulate a delay of 2 seconds before showing the result
    }

    // Function to display phishing result
    function displayPhishingResult(phishingScore) {
        loader.style.display = "none"; // Hide the loader
        if (phishingScore > 0) {
            resultDiv.textContent = `This text or image is phishing with a ${phishingScore}% likelihood.`;
        } else {
            resultDiv.textContent = "This text or image is not phishing.";
        }
    }
});
