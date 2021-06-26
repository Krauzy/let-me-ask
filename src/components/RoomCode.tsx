import Copy from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyToClipboard}>
            <div>
                <img src={Copy} alt="Copiar código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}