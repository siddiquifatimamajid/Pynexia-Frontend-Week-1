// Get HTML elements
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

// Switch between Login and Registration
function showForm(formType) {
    clearMessages();

    const isLogin = formType === "login";

    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    formTitle.textContent = isLogin
        ? "Welcome back"
        : "Create your account";

    formSubtitle.textContent = isLogin
        ? "Sign in to continue to your account."
        : "Fill in your details to get started.";
}

loginTab.addEventListener("click", () => showForm("login"));
registerTab.addEventListener("click", () => showForm("register"));

// Display validation errors
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add("invalid");
    error.textContent = message;
}

// Clear validation errors
function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.remove("invalid");
    error.textContent = "";
}

// Clear all messages when switching forms
function clearMessages() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("invalid");
    });

    document.querySelectorAll(".form-message").forEach(message => {
        message.textContent = "";
        message.className = "form-message";
    });
}

// Check email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Display form-level feedback
function showFormMessage(elementId, message, type) {
    const element = document.getElementById(elementId);

    element.textContent = message;
    element.className = `form-message ${type}`;
}

// Login form validation
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearMessages();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let isValid = true;

    if (!email) {
        showError("loginEmail", "loginEmailError", "Email address is required.");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("loginEmail", "loginEmailError", "Please enter a valid email address.");
        isValid = false;
    }

    if (!password) {
        showError("loginPassword", "loginPasswordError", "Password is required.");
        isValid = false;
    } else if (password.length < 8) {
        showError("loginPassword", "loginPasswordError", "Password must be at least 8 characters.");
        isValid = false;
    }

    if (isValid) {
        showFormMessage(
            "loginMessage",
            "Input validation successful. Connect a backend for real authentication.",
            "success"
        );
    }
});

// Registration form validation
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearMessages();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    let isValid = true;

    if (!name) {
        showError("registerName", "registerNameError", "Full name is required.");
        isValid = false;
    } else if (name.length < 2) {
        showError("registerName", "registerNameError", "Name must contain at least 2 characters.");
        isValid = false;
    }

    if (!email) {
        showError("registerEmail", "registerEmailError", "Email address is required.");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("registerEmail", "registerEmailError", "Please enter a valid email address.");
        isValid = false;
    }

    if (!password) {
        showError("registerPassword", "registerPasswordError", "Password is required.");
        isValid = false;
    } else if (password.length < 8) {
        showError("registerPassword", "registerPasswordError", "Password must be at least 8 characters.");
        isValid = false;
    }

    if (!confirmPassword) {
        showError("confirmPassword", "confirmPasswordError", "Please confirm your password.");
        isValid = false;
    } else if (password !== confirmPassword) {
        showError("confirmPassword", "confirmPasswordError", "Passwords do not match.");
        isValid = false;
    }

    if (isValid) {
        showFormMessage(
            "registerMessage",
            "All fields are valid. Connect a backend to create an account.",
            "success"
        );
    }
});

// Show or hide password
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", function () {
        const targetId = this.dataset.target;
        const passwordInput = document.getElementById(targetId);

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        this.textContent = isPassword ? "Hide" : "Show";
    });
});

// Remove an input error when the user starts correcting it
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", function () {
        this.classList.remove("invalid");

        const errorElement = document.getElementById(`${this.id}Error`);

        if (errorElement) {
            errorElement.textContent = "";
        }
    });
});