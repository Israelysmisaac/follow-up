FROM node
    
# Configure apt
ENV DEBIAN_FRONTEND=noninteractive

# Install the Angular CLI
RUN npm install -g @angular/cli

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=dialog

# Expose port 4200
EXPOSE 4200

# Set the default shell to bash instead of sh
ENV SHELL /bin/bash