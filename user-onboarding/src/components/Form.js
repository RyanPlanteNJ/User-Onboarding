import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

export default function Form () {
    const [user, setUser] = useState([]);

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

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const formSchema = yup.object().shape({
        name: yup.string().required("Name required in order to join"),
        email: yup.string().email("Email not valid. Please check again").required(),
        terms: yup.boolean().oneOf([true], "You must agree to Terms of Service in order to join"),
        password: yup.string().required("Please enter in a password")
    });

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then (valid => {
                setErrors({...errors, [e.target.name]: "" });
            })
            .catch(err => setErrors({...errors, [e.target.name]: err.errors[0] }));
    };

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            console.log("valid?", valid);
            setIsButtonDisabled(!valid);
        });
    }, [formState]);

    const formSubmit = e => {
        e.preventDefault();
        console.log("Form sent!");
        axios
            .post("https://reqres.in/api/users")
            .then (response => {
                setUser(response.data);
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
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name: 
                <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={inputChange}
                    value={formState.name}
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null }
            </label>

            <label htmlFor="email">
                Email:
                <input
                    id="email"
                    type="email"
                    name="email"
                    onChange={inputChange}
                    value={formState.email}
                />
                {errors.email.length > 0 ? (
                    <p className="error">{errors.email}</p>
                ) : null }
            </label>

            <label htmlFor="password">
                Password:  
                <input
                    id="password"
                    type="password"
                    name="password"
                    onChange={inputChange}
                    value={formState.password}
                />
            </label>

            <label htmlFor="terms" className="terms">
                <input
                type="checkbox"
                name="terms"
                onChange={inputChange}
                checked={formState.terms}   
                />
                Terms of Service
            </label>

            <button disabled={isButtonDisabled} type="submit">
                Submit
            </button>
            <pre>{JSON.stringify(user,null,1)}</pre>
           </form>
    )
}