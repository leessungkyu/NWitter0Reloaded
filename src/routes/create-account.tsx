import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, errors, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/GithubButton";
import ForgetPassword from "../components/ForgetPassword";



export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState({name: "", email: "", password:""});
    const [error,setError] = useState("");
    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {target :{name , value}} = e;
        if (name === "name"){
            setUser({...user, name:value});
        } else if (name === "email"){
            setUser({...user,email: value});
        } else if (name === "password"){
            setUser({...user, password:value});
        }
    }
    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || user.name === "" || user.email === "" || user.password === "") return;
        try {
              setLoading(true);
              const credentials =  await createUserWithEmailAndPassword(auth, user.email, user.password);  
              await updateProfile(credentials.user, {
                displayName: user.name,
              });
            navigate("/");
        } catch(e) {
            console.log(e);
            if (e instanceof FirebaseError){
                setError(errors[e.message] || "Error");
            }
        } finally {
            setLoading(false);
        }
        console.log(user.name, user.email, user.password);
    }

    return <Wrapper>
        <Title>JOIN 👤</Title>
        <Form onSubmit={submit}>
            <Input name="name" placeholder="Name" type="text" value={user.name} onChange={onChange} required/>
            <Input name="email" placeholder="Email" type="email" value={user.email} onChange={onChange} required/>
            <Input name="password" placeholder="Password" type="password" value={user.password} onChange={onChange} required/>
            <Input type="submit" value={isLoading? "Loadign":"Create Acount"}/>
        </Form>
        {error?<Error>{error}</Error> : null}
        <Switcher>
            Already have an account?
            <Link to={"/login"}> Login &rarr;</Link>
        </Switcher>
        <ForgetPassword email={user.email} />
        <GithubButton />
    </Wrapper>
}