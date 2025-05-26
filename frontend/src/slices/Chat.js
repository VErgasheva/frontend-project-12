import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData, setCurrentChannel, addMessage } from '../store';
import { io } from 'socket.io-client';

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/v1/channels/${currentChannelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: text }),
      });
      if (!response.ok) throw new Error('Ошибка отправки');
      setText('');
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        disabled={sending}
      />
      <button type="submit" disabled={sending || !text.trim()} style={{ padding: '8px 18px' }}>
        {sending ? 'Отправка...' : 'Отправить'}
      </button>
      {error && <div style={{ color: 'red', marginLeft: 10 }}>{error}</div>}
    </form>
  );
};

const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io('/', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  if (!channels.length) return <div>Нет доступных каналов</div>;

  const currentMessages = messages.filter((m) => m.channelId === currentChannelId);

  return (
    <div style={{ display: 'flex', height: '80vh', border: '1px solid #eee', borderRadius: 8 }}>
      {}
      <div style={{
        width: 220, borderRight: '1px solid #ddd', padding: 10, background: '#fafafa',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>Каналы</div>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            style={{
              background: channel.id === currentChannelId ? '#e6f7ff' : 'transparent',
              border: 'none',
              textAlign: 'left',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: 4,
              marginBottom: 5,
              fontWeight: channel.id === currentChannelId ? 'bold' : 'normal',
            }}
          >
            # {channel.name}
          </button>
        ))}
      </div>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
        <div style={{
          flex: 1, overflowY: 'auto', marginBottom: 16, borderBottom: '1px solid #eee',
          paddingBottom: 12,
        }}>
          {currentMessages.length === 0
            ? <div style={{ color: '#999' }}>Нет сообщений</div>
            : currentMessages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>{msg.username}:</span>
                <span>{msg.body}</span>
              </div>
            ))}
        </div>
        <MessageForm currentChannelId={currentChannelId} />
      </div>
    </div>
  );
};

export default Chat;