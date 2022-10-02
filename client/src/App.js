import './App.css'
import {useEffect, useRef, useState} from "react"

function App() {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const [name, setName] = useState('')
    const [connected, setConnected] = useState(false)
    const socket = useRef()

    function connect(e) {
        e.preventDefault()
        socket.current = new WebSocket('ws://localhost:777')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                name,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            console.log(messages)
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('соединение разорвано')

        }
        socket.current.onerror = () => {
            console.log('ошибка соединения')
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if(!value) return

        const message = {
            name,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className="modal-wrapper">
                <div className="modal">
                    <form onSubmit={connect}>

                        <div className="modal-content">
                            <input
                                className={'modal-input'}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                type="text"
                                placeholder="Введите ваше имя"/>
                            <button type='submit' className={"submit-button"}>Войти</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }


    return (
        <div className="modal-wrapper">
            <div className={'messages-modal'}>
                <form onSubmit={sendMessage}>
                    <div className="form">
                        <input className={'modal-input'} value={value} onChange={e => setValue(e.target.value)}
                               type="text"/>
                        <button className={"submit-button"} type={'submit'}>Отправить</button>
                    </div>
                </form>

                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь {mess.name} подключился
                                </div>
                                : mess.name === name ?
                                    <div className="my-message">
                                        {mess.message}
                                    </div>
                                    :<div className="message">
                                    {mess.name}: {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
