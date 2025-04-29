import * as Yup from 'yup';

export const workshopSignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name is too short")
        .max(50, "Name is too long")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    mobile: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .required("Mobile number is required"),
    country: Yup.string()
        .min(2, "Country name is too short")
        .max(50, "Country name is too long")
        .required("Country is required"),
    state: Yup.string()
        .min(2, "State name is too short")
        .max(50, "State name is too long")
        .required("State is required"),
    city: Yup.string()
        .min(2, "City name is too short")
        .max(50, "City name is too long")
        .required("City is required"),
    streetAddress: Yup.string()
        .min(5, "Street Address is too short")
        .max(100, "Street Address is too long")
        .required("Street Address is required"),
    buildingNo: Yup.string()
        .matches(/^[A-Za-z0-9\s-]+$/, "Building number can only contain letters, numbers, spaces, and hyphens")
        .min(1, "Building number is too short")
        .max(10, "Building number is too long")
        .required("Building number is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
})