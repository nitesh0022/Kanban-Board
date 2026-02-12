const mockAPI = {
  delay: () => new Promise(resolve => {
    const randomDelay = 1000 + Math.random() * 1000;
    setTimeout(resolve, randomDelay);
  }),
  
  shouldFail: () => Math.random() < 0.2,
  
  async addTask(task) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error('Failed to add task');
    }
    return task;
  },
  
  async moveTask(taskId, fromColumn, toColumn) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error('Failed to move task');
    }
    return { taskId, fromColumn, toColumn };
  },
  
  async deleteTask(taskId, columnId) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error('Failed to delete task');
    }
    return { taskId, columnId };
  }
};

export default mockAPI;
