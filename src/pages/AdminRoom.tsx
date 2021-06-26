// Hooks
import { useHistory, useParams } from 'react-router-dom'

// Images
import Logo from '../assets/images/logo.svg'
import Delete from '../assets/images/delete.svg'
import Check from '../assets/images/check.svg'
import Answer from '../assets/images/answer.svg'

// Components
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

// Styles
import '../styles/room.scss'

// Services
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type ParamsType = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<ParamsType>();
    const history = useHistory()
    // const { user } = useAuth();
    const { questions, title } = useRoom(params.id)

    async function deleteRoom() {
        await database.ref(`rooms/${params.id}`).update({
            endedAt: new Date()
        });
        history.push('/');
    }

    async function deleteQuestion(id: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${params.id}/questions/${id}`).remove()
        }
    }

    async function checkQuestion(id: string) {
        await database.ref(`rooms/${params.id}/questions/${id}`).update({
            isAnswered: true
        })
    }

    async function answerQuestion(id: string) {
        await database.ref(`rooms/${params.id}/questions/${id}`).update({
            isHighlighted: true
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={Logo} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id}/>
                        <Button 
                            isOutlined
                            onClick={deleteRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="">
                <div className="room-title">
                    <h1>Sala #{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}                    
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => checkQuestion(question.id)}    
                                        >
                                            <img src={Check} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => answerQuestion(question.id)}    
                                        >
                                            <img src={Answer} alt="Destacar pergunta" />
                                        </button>
                                    </>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => deleteQuestion(question.id)}    
                                >
                                    <img src={Delete} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}