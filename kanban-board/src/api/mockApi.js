const mockAPI = {
  // Random delay between 1-2 seconds
  delay: () =>
    new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000)),

  // 20% chance of failure
  shouldFail: () => Math.random() < 0.2,

  // <---------------Add a new task------------------->
  async addTask(task, columnId) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error("Failed to add task");
    }
    return { success: true, task };
  },

  // <-------------------Move task between columns------------------------>
  async moveTask(taskId, fromColumn, toColumn) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error("Failed to move task");
    }
    return { success: true };
  },

  // -------------- Delete a task----------------->
  async deleteTask(taskId, columnId) {
    await this.delay();
    if (this.shouldFail()) {
      throw new Error("Failed to delete task");
    }
    return { success: true };
  },
};

export default mockAPI;
