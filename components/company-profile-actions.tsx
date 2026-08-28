"use client";
import { useEffect,useState } from "react";
import { Bookmark,Share2 } from "lucide-react";

export function CompanyProfileActions({slug,name}:{slug:string;name:string}){
 const[following,setFollowing]=useState(false);const[saved,setSaved]=useState(false);const[message,setMessage]=useState("");
 useEffect(()=>{const timer=window.setTimeout(()=>{setFollowing(localStorage.getItem(`orbit-follow-${slug}`)==="1");try{setSaved(JSON.parse(localStorage.getItem("orbit-company-bookmarks")||"[]").includes(slug))}catch{}},0);return()=>window.clearTimeout(timer)},[slug]);
 function follow(){setFollowing(value=>{localStorage.setItem(`orbit-follow-${slug}`,value?"0":"1");return!value})}
 function bookmark(){setSaved(value=>{let list:string[]=[];try{list=JSON.parse(localStorage.getItem("orbit-company-bookmarks")||"[]")}catch{}const next=value?list.filter(x=>x!==slug):Array.from(new Set([...list,slug]));localStorage.setItem("orbit-company-bookmarks",JSON.stringify(next));return!value})}
 async function share(){const url=location.href;try{if(navigator.share)await navigator.share({title:name,url});else{await navigator.clipboard.writeText(url);setMessage("Link copied");window.setTimeout(()=>setMessage(""),1600)}}catch{}}
 return <div className="orbit-profile-actions"><button className={following?"following":""} onClick={follow}>{following?"Following":"Follow"}</button><button className={saved?"active":""} onClick={bookmark} aria-label="Bookmark"><Bookmark size={17} fill={saved?"currentColor":"none"}/></button><button onClick={share} aria-label="Share"><Share2 size={17}/></button>{message&&<span className="profile-action-message">{message}</span>}</div>;
}
