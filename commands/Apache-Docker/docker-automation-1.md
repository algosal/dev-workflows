It looks like the Docker Engine service is not installed or not running on your system. This error occurs when the service with the name `docker` is not found, meaning Docker Engine is either not installed or configured incorrectly.

Here are steps you can follow to troubleshoot and resolve this issue:

### 1. **Verify Docker Engine Installation**

Make sure Docker Engine is installed properly on your system.

- If you're using **Docker Desktop**, the Docker Engine service should be installed with it. If you installed Docker through the Desktop app, ensure that it's installed and running.
- If you want Docker without the Docker Desktop interface, you'll need to install Docker Engine separately. You can follow the official instructions for installing Docker Engine binaries on Windows: [Install Docker Engine on Windows](https://docs.docker.com/engine/install/binaries/#install-client-binaries-on-windows).

### 2. **Check If Docker Desktop is Installed**

If you have Docker Desktop installed but want to use the engine without starting the GUI, you can check its services:

1. **Start Docker Desktop** and then open PowerShell as Administrator.
2. Run the following command to check all services:

   ```powershell
   Get-Service | Where-Object { $_.DisplayName -like "*Docker*" }
   ```

   This will list any services related to Docker, including the Docker Engine service.
