import styled from "styled-components";

export const errors: Record<string, string> = {
    "auth/email-already-in-use": "That email already exists", // Fixed typo here
};

export const Wrapper = styled.div`
    height: 100%; /* Fixed the colon to a semicolon */
    display: flex;
    flex-direction: column;
    align-items: center; /* Fixed the typo here */
    justify-content: center; /* Fixed the typo here */
    width: 420px;
    padding: 50px 0px;
    margin: auto;
`;

export const Title = styled.h1`
    font-size: 42px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    margin-top: 20px;

    &[type="submit"] {
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
`;

export const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

export const Switcher = styled.span`
    margin-top: 20px;
    a {
        color: #1d9bf0;
    }
`;

export const Button = styled.span`
    margin-top: 50px;
    background-color: white;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 50px;
    width: 100%;
    color: black;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;
export const Logo = styled.img`
    height: 25px;
`;
