const apiRoutes = {
  channels: () => '/api/v1/channels',
  channel: id => `/api/v1/channels/${id}`,
  login: () => '/api/v1/login',
  signup: () => '/api/v1/signup',
  messages: () => '/api/v1/messages',
}

export default apiRoutes
