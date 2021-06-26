//Handlers
import { FormEvent } from 'react';

//Hooks
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom'

// Images
import Illustration from '../assets/images/illustration.svg'
import Logo from '../assets/images/logo.svg'

// Styles
import '../styles/auth.scss'

// Components
import { Button } from '../components/Button';
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { database } from '../services/firebase';

export function NewRoom() {
    const { user } = useAuth();
    const [room, setRoom] = useState('')
    const history = useHistory();

    async function handleForm(event: FormEvent) {
        event.preventDefault();
        if (room.trim() === '') {
            return;
        }
        const roomRef = database.ref('rooms');
        const firebaseRoom = await roomRef.push({
            title: room,
            authorId: user?.id 
        });
        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={Illustration} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={Logo} alt="Letmeask" />
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleForm}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"
                            onChange={event => setRoom(event.target.value)}
                            value={room}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}