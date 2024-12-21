import { useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius:25px;
    font-size: 16px;
    color: black;
    background-color: balck;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus{
        outline: none;
        border-color: #1d9bf0;
    }
`;
const AttachFileBtn = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 25px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;
const AttachFileInput = styled.input`
    display: none;
`;
const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState('');
    const [file, setFile] = useState<File|null>(null);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }
    const onFileCHange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (files && files.length === 1){
            setFile(files[0]);
        }
    }
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(!user || isLoading || tweet === "" || tweet.length > 180) return;
        try {
            setLoading(true);
            const doc = await addDoc(collection(db,"tweets"),{
                tweet,
                createdAt: Date.now(),
                username: user.displayName ||"Anoymous",
                userId: user.uid,
            });
            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                })
            }
        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
            setTweet("");
            setFile(null);
        }
    }
    return <Form onSubmit={onSubmit}>
        <TextArea rows={5} maxLength={180} placeholder="what is happen" value={tweet} onChange={onChange}/>
        <AttachFileBtn htmlFor="file">{file ? "Photo added 💼" : "add Poto"}</AttachFileBtn>
        <AttachFileInput type="file" id="file" accept="image/*" onChange={onFileCHange}/>
        <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Submit"} />
    </Form>
}