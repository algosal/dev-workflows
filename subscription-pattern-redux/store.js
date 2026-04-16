class Store {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
    this.subscribers = [];
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);

    this.subscribers.forEach((cb) => cb(this.state));
  }
}

export default Store;
