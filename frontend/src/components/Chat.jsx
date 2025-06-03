import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData, setCurrentChannel, addMessage, addChannel, removeChannel, renameChannel } from '../store';
import { io } from 'socket.io-client';
import { AddChannelModal, RenameChannelModal, RemoveChannelModal } from './ChannelModals.jsx';

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
const ChannelMenu = ({
  channel, isRemovable, onRename, onRemove, loading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        aria-label="Меню канала"
        onClick={() => setOpen((v) => !v)}
        style={{
          marginLeft: 4,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          color: '#888',
          verticalAlign: 'middle',
        }}
        disabled={loading}
      >⋮</button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 28, background: '#fff', border: '1px solid #ddd', borderRadius: 5, zIndex: 10,
          boxShadow: '0 2px 12px #0002',
          minWidth: 120,
        }}>
          <button
            onClick={() => { setOpen(false); onRename(); }}
            style={{
              display: 'block', width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer',
            }}
            disabled={loading}
          >Переименовать</button>
          <button
            onClick={() => { setOpen(false); onRemove(); }}
            style={{
              display: 'block', width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', color: '#e45', cursor: 'pointer',
            }}
            disabled={loading}
          >Удалить</button>
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, error } = useSelector((state) => state.chat);

  const [addOpen, setAddOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

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

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel(id));
    });

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannel(channel));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  if (!channels.length) return <div>Нет доступных каналов</div>;

  const currentMessages = messages.filter((m) => m.channelId === currentChannelId);
  const currentChannel = channels.find((ch) => ch.id === currentChannelId);

  const removableChannelIds = channels.filter(ch => ch.removable).map(ch => ch.id);

  const handleMenuRename = (channel) => {
    setSelectedChannel(channel);
    setRenameOpen(true);
  };
  const handleMenuRemove = (channel) => {
    setSelectedChannel(channel);
    setRemoveOpen(true);
  };

  const handleAddChannel = async (name) => {
    setModalLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Ошибка создания канала');
      const data = await response.json();
      dispatch(setCurrentChannel(data.id));
      setAddOpen(false);
    } catch (e) {
    } finally {
      setModalLoading(false);
    }
  };
  const handleRenameChannel = async (name) => {
    setModalLoading(true);
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/channels/${selectedChannel.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      setRenameOpen(false);
    } catch (e) {
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveChannel = async () => {
    setModalLoading(true);
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/channels/${selectedChannel.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRemoveOpen(false);
    } catch (e) {
    } finally {
      setModalLoading(false);
    }
  };

  const channelNames = channels.map(ch => ch.name);
  const channelNamesWithoutSelected = selectedChannel
    ? channels.filter(ch => ch.id !== selectedChannel.id).map(ch => ch.name)
    : channelNames;

  return (
    <div style={{ display: 'flex', height: '80vh', border: '1px solid #eee', borderRadius: 8 }}>
      {/* Список каналов */}
      <div style={{
        width: 240, borderRight: '1px solid #ddd', padding: 10, background: '#fafafa',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Каналы</span>
          <button
            onClick={() => setAddOpen(true)}
            style={{
              background: '#1890ff', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px',
              fontSize: 20, fontWeight: 'bold', cursor: 'pointer', marginLeft: 10,
            }}
            aria-label="Добавить канал"
            disabled={modalLoading}
          >+</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {channels.map((channel) => (
            <div key={channel.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <button
                onClick={() => dispatch(setCurrentChannel(channel.id))}
                style={{
                  background: channel.id === currentChannelId ? '#e6f7ff' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontWeight: channel.id === currentChannelId ? 'bold' : 'normal',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
                title={channel.name}
              >
                # {channel.name}
              </button>
              {channel.removable && (
                <ChannelMenu
                  channel={channel}
                  isRemovable
                  onRename={() => handleMenuRename(channel)}
                  onRemove={() => handleMenuRemove(channel)}
 loading={modalLoading}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Чат и сообщения */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, minWidth: 0 }}>
        <div style={{
          flex: 1, overflowY: 'auto', marginBottom: 16, borderBottom: '1px solid #eee',
          paddingBottom: 12, minHeight: 0,
        }}>
          {currentMessages.length === 0
            ? <div style={{ color: '#999' }}>Нет сообщений</div>
            : currentMessages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 10, wordBreak: 'break-word' }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>{msg.username}:</span>
                <span>{msg.body}</span>
              </div>
            ))}
        </div>
        <MessageForm currentChannelId={currentChannelId} />
      </div>

      {/* Модальные окна */}
      <AddChannelModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddChannel}
        existingNames={channelNames}
        loading={modalLoading}
      />
      <RenameChannelModal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        onRename={handleRenameChannel}
        existingNames={channelNamesWithoutSelected}
        initialName={selectedChannel?.name}
        loading={modalLoading}
      />
      <RemoveChannelModal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onRemove={handleRemoveChannel}
        channelName={selectedChannel?.name}
        loading={modalLoading}
      />
    </div>
  );
};

export default Chat;