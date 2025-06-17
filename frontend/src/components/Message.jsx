function Message({ message }) {
  return (
    <div className="text-break mb-2">
      <b>{message.username}</b>
      {`: ${message.body}`}
    </div>
  )
}

export default Message
