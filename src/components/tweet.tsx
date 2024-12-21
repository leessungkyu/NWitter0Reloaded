import styled from "styled-components";
import { ITweet } from "./Timeline";
import { auth, db, storage } from "../firebase/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;
const Column = styled.div``;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 15px;
`;
const PhotoDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Photo = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 15px;
    align-items: center;
    margin-bottom: 10px;
`;
const BtnDiv = styled.div`
    display: flex;
    gap: 10px;
    justify-content: left;
    align-items: center;
`;
const Btn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
`;
const AttachFileBtn = styled.label`
    padding: 10px 0px;
    color: white;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;
export default function Tweet({
    username,
    photo,
    tweet,
    userId,
    id,
    setTweets,
}: ITweet & { setTweets: React.Dispatch<React.SetStateAction<ITweet[]>> }) {
    const user = auth.currentUser;
    const [state, setState] = useState('init');
    const [edit, setEdit] = useState('');

    const onDelte = async () => {
        const ok = confirm('Are you sure you want to delte this tweet?');
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if(photo){
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                deleteObject(photoRef);
            }
        } catch(e) {
            console.error(e);
        } 
    }
    const onEdit = async () => {
        const ok = confirm("Are you Sure?");
        if(!ok) return;
        try {
            await updateDoc(doc(db,"tweets",id), {tweet: edit});
            setTweets((prev)=>prev.map((t)=>(t.id===id ? {...t, tweet: edit} : t )));
        } catch(e) {
            console.error(e);
        } finally {
            setState('init');
        }
    }
    const onFileCHange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // 선택된 파일 가져오기
        if (file) {
            try {
                const locationRef = ref(storage, `tweets/${userId}/${id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
    
                // Firestore 업데이트
                await updateDoc(doc(db, "tweets", id), { photo: url });
    
                // 상태 업데이트
                setTweets((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, photo: url } : t))
                );
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("File upload failed. Please try again.");
            }
        } else {
            alert("No file selected.");
        }
    };
    
    const onDeletePhoto = async () => {
        const ok = confirm("Are you sure you want to delete this photo?");
        if (!ok) return;
    
        try {
            const locationRef = ref(storage, `tweets/${userId}/${id}`);
            await deleteObject(locationRef);
    
            // Firestore 업데이트
            await updateDoc(doc(db, "tweets", id), { photo: "" });
    
            // 상태 업데이트
            setTweets((prev) =>
                prev.map((t) => (t.id === id ? { ...t, photo: "" } : t))
            );
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Photo deletion failed. Please try again.");
        }
    };
    return <Wrapper>
        <Column>
            <Username>{username}</Username>
            {state == 'edit' ?
            <div style={{margin:"10px 0px"}}>
                <input type="text" style={{width:"100%", borderRadius: "15px"}} value={edit} onChange={(e) => setEdit(e.target.value)}></input>
            </div>
            :
            <Payload>{tweet}</Payload>
            }
            {user?.uid === userId ?
                state === 'edit' ?
                <BtnDiv>
                    <Btn onClick={onEdit}>ok</Btn>
                </BtnDiv>
                :<BtnDiv>
                    <Btn onClick={onDelte}>Delete</Btn> 
                    <Btn onClick={()=>{
                        setState('edit');
                        setEdit(tweet);
                    }} >Edit</Btn>
                 </BtnDiv>
            : null 
           }
        </Column>
        <Column>
        {   
            photo ?
            <PhotoDiv>
                <Photo src={photo} />
                <BtnDiv>
                    <AttachFileBtn htmlFor="file1">Edit</AttachFileBtn>
                    <AttachFileBtn onClick={onDeletePhoto}>Delete</AttachFileBtn>
                    <input type="file" id="file1" hidden accept="image/*" onChange={onFileCHange}></input>
                </BtnDiv>
            </PhotoDiv>
            : null
        }
        </Column>
    </Wrapper>
}