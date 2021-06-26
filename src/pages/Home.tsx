// Handlers
import { FormEvent } from 'react'

// Hooks
import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Images
import Illustration from '../assets/images/illustration.svg'
import Logo from '../assets/images/logo.svg'
import GoogleIcon from '../assets/images/google-icon.svg'

// Services
import { database } from '../services/firebase'

// Styles
import '../styles/auth.scss'

// Components
import { Button } from '../components/Button';
import { useState } from 'react'


export function Home() {
    const history = useHistory();
    const { user, OAuthGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function OAuth() {
        if (!user) {
           await OAuthGoogle();
        }
        history.push('/rooms/new');
    }

    async function handleJoin(event: FormEvent) {
        event.preventDefault();
        if (roomCode === '') {
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if (!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Sala já fechada');
            setRoomCode('');
            return;
        }
        
        history.push(`/rooms/${roomCode}`);
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
                    <button onClick={OAuth} className="create-room">
                        <img src={GoogleIcon} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoin}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}