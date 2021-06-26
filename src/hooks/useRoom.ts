import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirabaseQuestionsType = Record<string, {
    authorId: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState();

    useEffect(() => {
        // REFORMULAR PARA CAPTAR APENAS OS NOVOS FILHOS, E NÃO TODOS OS FILHOS
        
        console.log(roomId);
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value', room => {
            const dbRoom = room.val();
            const firebaseQuestions = dbRoom.questions as FirabaseQuestionsType;
            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
                return {
                    id: key, 
                    content: value.content,
                    author: value.authorId,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0]
                }
            });
            setTitle(dbRoom.title);
            setQuestions(parsedQuestions);
        });
        
        return () => {
            roomRef.off('value');
        }

    }, [roomId, user?.id]);

    return { questions, title }
}