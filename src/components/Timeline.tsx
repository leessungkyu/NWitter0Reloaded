import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase/firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt:number;
}
const Wrapper = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    height: 600px;
`;
export default function Timeline() {
    const [tweet, setTweet] = useState<ITweet[]>([]);

    useEffect(()=>{
        let unsubscribe : Unsubscribe | null = null;
        const fetchTweets = async() => {
            const tweetQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt","desc")
            );
            /*
            const snapshot = await getDocs(tweetQuery);
            const tweets = snapshot.docs.map((doc)=> {
                const {tweet, createdAt, userId, username, photo} = doc.data();
                return {tweet, createdAt, userId, username, photo, id: doc.id};
            });*/
            unsubscribe = await onSnapshot(tweetQuery, (snapshot)=>{
                const tweets = snapshot.docs.map((doc)=> {
                    const {tweet, createdAt, userId, username, photo} = doc.data();
                    return {tweet, createdAt, userId, username, photo, id: doc.id};
                });
                setTweet(tweets);
            });
        }  
        fetchTweets(); 
        return () => {
          unsubscribe && unsubscribe();
        }
    },[])
    return <Wrapper>{tweet.map(tweet=><Tweet key={tweet.id} {...tweet} setTweets={()=>setTweet}/>)}</Wrapper>
}