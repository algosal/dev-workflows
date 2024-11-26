#### Method 2: Use Task Scheduler to Start Docker Engine at Boot

If for some reason the above method doesn't work, you can configure **Task Scheduler** to start the Docker Engine service on startup:

1. **Open Task Scheduler**:

   - Press `Win + R`, type `taskschd.msc`, and press Enter.

2. **Create a New Task**:
   - In Task Scheduler, click **Action** > **Create Task**.
3. **General Tab**:
   - Give your task a name like "Start Docker Engine".
   - Select **Run with highest privileges**.
4. **Triggers Tab**:
   - Click **New** to add a trigger.
   - Set **Begin the task** to **At startup**.
5. **Actions Tab**:

   - Click **New** to add an action.
   - For **Action**, select **Start a program**.
   - In the **Program/script** field, enter the following to start Docker Engine:

     ```cmd
     powershell.exe
     ```

- In the **Add arguments** field, add the appropriate command to start the Docker service based on your installation method:

### 1. **Installed as Standalone Docker Service**

If Docker Engine is installed as a standalone service:

```powershell
Start-Service -Name docker
```

### 2. **Installed with Docker Desktop**

If Docker Engine is managed through Docker Desktop:

```powershell
Start-Service -Name com.docker.service
```

This ensures you start the correct service based on your Docker installation type.

6. **Save the Task**:

   - Click **OK** to save the task.

   This will ensure that Docker Engine starts automatically each time Windows boots up.

### 3. **Disable Docker Desktop on Startup**

If Docker Desktop is starting automatically and you want to prevent that, do the following:

1. **Open Docker Desktop**.
2. Go to **Settings** > **General**.
3. Uncheck the option **Start Docker Desktop when you log in**.

This will stop Docker Desktop from starting automatically while keeping the Docker Engine running on startup.

### Summary:

- Use PowerShell to set the Docker Engine to start automatically on system boot.
- Use Task Scheduler as a fallback option if needed.
- Disable Docker Desktop from starting automatically through its settings.

Let me know if you need further clarification!
