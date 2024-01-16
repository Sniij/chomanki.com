"use client";

type Comment = {
    slug?: string
    content?: string
    createdAt?: string
    imgUrl?: string
    nickname?: string
}

export default function Card(comment: Comment){
    const { slug, content, createdAt, imgUrl, nickname } = comment;

    return (
        
        <div className="card">
            <img src={imgUrl} alt={slug}/>
            <h5>{nickname}</h5>
            <p>{createdAt}</p>
            <p>{content}</p>
        </div>

    )
}