import styled from "styled-components";
import { auth, db, storage } from "../firebase/firebase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/Timeline";
import Tweetss from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        height: 40px;
    }
`;
const AvatarImg = styled.img`
   width: 100%;
   height: 100%;
`;
const AvataInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size : 22px;
    display: flex;
    gap: 10px;
`;
const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;
const Btn = styled.label`
    padding: 10px 0px;
    color: white;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;
export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL||"");
    const [tweets,setTweets] = useState<ITweet[]>([]);
    const [displayNM, setDisplayNM] = useState('');
    const [displaychg, setDisplaychg] = useState(false);
    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(!user) return;
        if (files && files.length === 1){
            const file = files[0];
            const locationRef = ref(storage,`avatar/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(result.ref);
            setAvatar(url);
            await updateProfile(user, {
                photoURL: url,
            })
        }
    }
    const onChangDisplaynm = async () => {
        if (!user || displayNM.length === 0) return;
        await updateProfile(user, {
            displayName : displayNM,
        })
        setDisplaychg(false);
    }
    const fetchTweets = async () => {
        const tweetQuery = query(collection(db, "tweets"),
        where("userId","==",user?.uid),
        orderBy("createdAt","desc"),
        limit(25),
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc)=> {
            const {tweet, createdAt, userId, username, photo} = doc.data();
            return {tweet, createdAt, userId, username, photo, id: doc.id};
        });
        setTweets(tweets);
    }
    useEffect(()=>{fetchTweets();},[user?.uid]);
    return <Wrapper>
        <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? <AvatarImg src={avatar}/> 
            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
        </AvatarUpload>
        <AvataInput type="file" accept="image/*" id="avatar" onChange={onAvatarChange}/>
        <Name>
            {displaychg ?
               <input type ='text' value={displayNM} onChange={(e)=>setDisplayNM(e.target.value)}/>
            :        
               user?.displayName ?? "Anomymaus"
            }
            <Btn onClick={()=>setDisplaychg(!displaychg)}>{displaychg ? "Cancel" : "Change"}</Btn>
            {displaychg ? <Btn onClick={onChangDisplaynm}>OK</Btn> : null}
        </Name>
        <Tweets>
            {tweets.map(tweet => <Tweetss key={tweet.id} {...tweet}  setTweets={()=>setTweets}/>)}
        </Tweets>
    </Wrapper>
}