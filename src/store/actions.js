import chatkit from '../chatkit';

function handleError(commit, error) {
  const message = error.message || error.info.error_description;
  commit('setError', message);
}

export default {
  async login({ commit, state }, userId) {
    try {
      commit('setError', '');
      commit('setLoading', true);
      const currentUser = await chatkit.connectUser(userId);
      commit('setUser', {
        username: currentUser.id,
        name: currentUser.name
      });
      try {
        const rooms = currentUser.rooms.map(room => ({
          id: room.id,
          name: room.name
        }));
        commit('setRooms', rooms);
        const activeRoom = state.activeRoom || rooms[0];
        commit('setActiveRoom', {
          id: activeRoom.id,
          name: activeRoom.name
        });
        await chatkit.subscribeToRoom(activeRoom.id);
        return true;
      } catch (error) {
        console.log(error);
      }
      commit('setReconnect', false);
    } catch (error) {
      handleError(commit, error);
    } finally {
      commit('setLoading', false);
    }
  }
};
