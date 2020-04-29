import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import styled from 'styled-components';

export default function Form () {
    const [post, setPost] = useState([])
    const [formState, setFormState] = useState ({
        name: "",
        email: "",
        password: "",
        terms: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("Name required in order to join"),
        email: yup
            .string()
            .email("Email not valid. Please check again")
            .required(),
        terms: yup
            .boolean()
            .oneOf([true], "You must agree to Terms of Service in order to join")
    });

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then (valid => {
                setErrors({...errors, [e.target.name]: "" });
            })
            .catch(err => setErrors({...errors, [e.target.name]: err.errors[0]}));
    }

    useEffect(() => {
        formSchema.isValid(formState).then (valid => {
            setIsButtonDisabled(!valid);
        });
    },[formState]);

    const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users")
            .then (response => {
                setPost(response.data);
                setFormState({
                      name: "",
                      email: "",
                      password: "",
                      terms: "",
                });
            })
            .catch(err => console.log(err.response));
    };

    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    }

    return (
        <form>
            <label htmlFor="name">
                Name: 
                <input
                    id="name"
                    type="text"
                    name="name"
                />
            </label>

            <label htmlFor="email">
                Email:
                <input
                    id="email"
                    type="email"
                    name="email"
                />
            </label>

            <label htmlFor="password">
                Password:  
                <input
                    id="password"
                    type="password"
                    name="password"
                />
            </label>

            <label htmlFor="terms" className="terms">
                <input
                type="checkbox"
                name="terms"
                />
                Terms of Service
            </label>

            <button disabled={isButtonDisabled} type="submit">
                Submit
            </button>
        </form>
    )
}