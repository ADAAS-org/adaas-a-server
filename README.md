<img align="left" style="margin-right:40px; margin-bottom:80px;" width="180" height="80" src="./docs/a-logo-docs.png" alt="ADAAS Logo">

# A-Server SDK

| LTS | Latest | npm               |
|---------------|----------|---------------------------|
| v0.0.15      |   v0.0.15    |     [@adaas/a-server](https://www.npmjs.com/package/@adaas/a-server)    |

**A-Server** is a powerful SDK for building modular, scalable backend servers with TypeScript. It provides a comprehensive set of components for routing, entity management, CORS handling, health monitoring, and more - all built on the ADAAS ecosystem.

## Features

- 🚀 **Modular Architecture** - Component-based server structure
- 🛡️ **Built-in Security** - CORS, proxy, and error handling
- 📊 **Health Monitoring** - Real-time server health checks
- 🔄 **Entity Management** - Advanced CRUD operations with repositories
- 🌐 **Routing System** - Powerful decorator-based routing
- 📁 **Static File Serving** - Configurable static asset handling
- 🔧 **Configuration Management** - Environment-based configuration
- 📝 **Comprehensive Logging** - Built-in logging capabilities

## Installation

```bash
npm install @adaas/a-server
```

## Environment Variables

Configure your server using these environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `A_SERVER_PORT` | Port for the server to listen on | `3000` | No |
| `A_ROUTER__PARSE_PARAMS_AUTOMATICALLY` | Enable automatic parameter parsing | `true` | No |
| `CONFIG_VERBOSE` | Enable verbose configuration logging | `false` | No |
| `DEV_MODE` | Enable development mode features | `false` | No |

## Quick Start

### Basic Server Setup

```typescript
import { 
    A_Service, 
    A_EntityController, 
    A_Router, 
    A_ServerLogger,
    A_ServerHealthMonitor,
    A_ServerCORS
} from '@adaas/a-server';
import { A_Concept, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from '@adaas/a-concept';
import { A_Config, A_ConfigLoader, ENVConfigReader } from '@adaas/a-utils';

// Configure your application
const config = new A_Config({
    variables: [
        ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
        'A_SERVER_PORT',
        'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY'
    ] as const,
    defaults: {
        A_SERVER_PORT: 3000,
        A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true
    }
});

// Setup configuration loader
const SharedConfig = new A_ConfigLoader({
    components: [ENVConfigReader],
    fragments: [config]
});

// Create server service
const Server = new A_Service({
    components: [
        A_ServerLogger,
        A_Router,
        A_EntityController,
        A_ServerHealthMonitor,
        A_ServerCORS
    ]
});

// Create and start the concept
const concept = new A_Concept({
    name: 'my-server',
    containers: [SharedConfig, Server],
    fragments: [config]
});

(async () => {
    await concept.load();
    await concept.start();
    console.log('Server started successfully!');
})();
```

## Core Components

### A_EntityController

The `A_EntityController` provides a powerful base class for creating RESTful API endpoints with automatic CRUD operations.

```typescript
import { A_EntityController, A_Router } from '@adaas/a-server';
import { A_Component, A_Feature } from '@adaas/a-concept';

export class UserController extends A_EntityController {
    
    @A_Feature.Define({
        name: 'getUsers',
        invoke: false
    })
    @A_Router.Get({
        path: '/users'
    })
    async getUsers(request: A_Request, response: A_Response) {
        // Your custom logic here
        const users = await this.repository.findAll();
        return response.json(users);
    }

    @A_Feature.Define({
        name: 'createUser',
        invoke: false
    })
    @A_Router.Post({
        path: '/users'
    })
    async createUser(request: A_Request, response: A_Response) {
        const userData = request.body;
        const user = await this.repository.create(userData);
        return response.status(201).json(user);
    }
}
```

### A_Router

The `A_Router` component provides decorator-based routing with automatic parameter parsing and validation.

```typescript
import { A_Router, A_Request, A_Response } from '@adaas/a-server';
import { A_Component, A_Feature } from '@adaas/a-concept';

export class APIController extends A_Component {
    
    @A_Feature.Define({
        name: 'healthCheck',
        invoke: false
    })
    @A_Router.Get({
        path: '/health',
        params: {
            detailed: { type: 'boolean', required: false }
        }
    })
    async healthCheck(request: A_Request, response: A_Response) {
        const detailed = request.params.detailed;
        
        if (detailed) {
            return response.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage()
            });
        }
        
        return response.json({ status: 'ok' });
    }

    @A_Router.Post({
        path: '/api/data/:id',
        params: {
            id: { type: 'number', required: true }
        }
    })
    async processData(request: A_Request, response: A_Response) {
        const id = request.params.id;
        const data = request.body;
        
        // Process your data
        return response.json({ id, data, processed: true });
    }
}
```

### A_ListingController

The `A_ListingController` provides advanced listing capabilities with filtering, sorting, and pagination.

```typescript
import { A_ListingController } from '@adaas/a-server';

export class ProductListingController extends A_ListingController {
    
    protected getDefaultFilters() {
        return {
            category: { type: 'string', required: false },
            minPrice: { type: 'number', required: false },
            maxPrice: { type: 'number', required: false },
            inStock: { type: 'boolean', required: false }
        };
    }

    protected getDefaultSortFields() {
        return ['name', 'price', 'createdAt', 'category'];
    }

    protected async processQuery(filters: any, sort: any, pagination: any) {
        // Your custom query logic
        return await this.repository.findWithFilters(filters, sort, pagination);
    }
}
```

### A_ServerCORS

Configure Cross-Origin Resource Sharing (CORS) for your server.

```typescript
import { A_ServerCORS } from '@adaas/a-server';

// Basic CORS configuration
const corsComponent = new A_ServerCORS({
    origin: ['http://localhost:3000', 'https://mydomain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});
```

### A_ServerProxy

Set up proxy configurations for external services.

```typescript
import { A_ProxyConfig, A_ServerProxy } from '@adaas/a-server';

// Create proxy configuration
const proxyConfig = new A_ProxyConfig({
    '/api/external': 'https://api.external-service.com',
    '/assets/.*': 'https://cdn.example.com',
    '/docs': 'https://docs.example.com'
});

// Add to your concept fragments
const concept = new A_Concept({
    // ... other configuration
    fragments: [
        config,
        proxyConfig
    ]
});
```

### A_StaticLoader

Serve static files and assets.

```typescript
import { A_StaticConfig, A_StaticLoader } from '@adaas/a-server';

// Configure static file serving
const staticConfig = new A_StaticConfig([
    'public',
    'docs',
    'assets'
]);

// Add to your server components
const Server = new A_Service({
    components: [
        // ... other components
        A_StaticLoader
    ]
});

// Add to concept fragments
const concept = new A_Concept({
    // ... other configuration
    fragments: [
        config,
        staticConfig
    ]
});
```

### A_ServerHealthMonitor

Monitor your server's health and performance.

```typescript
import { A_ServerHealthMonitor } from '@adaas/a-server';

// The health monitor automatically provides endpoints:
// GET /health - Basic health check
// GET /health/detailed - Detailed system information
// GET /metrics - Performance metrics

// Add to your server components
const Server = new A_Service({
    components: [
        A_ServerHealthMonitor,
        // ... other components
    ]
});
```

### A_ServerLogger

Comprehensive logging capabilities for your server.

```typescript
import { A_ServerLogger } from '@adaas/a-server';

export class MyController extends A_Component {
    
    @A_Inject()
    private logger!: A_ServerLogger;

    async someMethod() {
        this.logger.info('Processing request');
        this.logger.warn('This is a warning');
        this.logger.error('An error occurred', { error: 'details' });
    }
}
```

## Advanced Usage

### Entity Repository Pattern

Create custom repositories for your entities:

```typescript
import { A_EntityRepository } from '@adaas/a-server';

export class UserRepository extends A_EntityRepository {
    
    async findByEmail(email: string) {
        return this.findOne({ email });
    }

    async findActiveUsers() {
        return this.findMany({ active: true });
    }

    async getUserStats() {
        return {
            total: await this.count(),
            active: await this.count({ active: true }),
            inactive: await this.count({ active: false })
        };
    }
}
```

### Command Pattern Implementation

Use the command pattern for complex operations:

```typescript
import { A_CommandController } from '@adaas/a-server';

export class UserCommandController extends A_CommandController {
    
    @A_Router.Post({
        path: '/commands/user/signup'
    })
    async executeSignUp(request: A_Request, response: A_Response) {
        const command = new SignUpCommand(request.body);
        const result = await this.executeCommand(command);
        return response.json(result);
    }
}
```

### Complete Server Example

Here's a comprehensive example showing all components working together:

```typescript
import {
    A_Service,
    A_EntityController,
    A_Router,
    A_ServerLogger,
    A_ServerHealthMonitor,
    A_ServerCORS,
    A_ServerProxy,
    A_StaticLoader,
    A_ListingController,
    A_ProxyConfig,
    A_StaticConfig
} from '@adaas/a-server';
import { 
    A_Concept, 
    A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY 
} from '@adaas/a-concept';
import { 
    A_Config, 
    A_ConfigLoader, 
    A_Polyfill, 
    ENVConfigReader 
} from '@adaas/a-utils';

// Custom entities
import { User } from './entities/User';
import { Product } from './entities/Product';

// Custom controllers
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';

// Custom repositories
import { UserRepository } from './repositories/UserRepository';

(async () => {
    // Configuration
    const config = new A_Config({
        variables: [
            ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
            'A_SERVER_PORT',
            'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY',
            'CONFIG_VERBOSE',
            'DEV_MODE'
        ] as const,
        defaults: {
            A_SERVER_PORT: 3000,
            A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
            CONFIG_VERBOSE: true,
            DEV_MODE: true
        }
    });

    const SharedConfig = new A_ConfigLoader({
        components: [ENVConfigReader],
        fragments: [config]
    });

    // Server service with all components
    const Server = new A_Service({
        components: [
            A_Polyfill,
            A_ServerLogger,
            A_Router,
            A_EntityController,
            A_ServerHealthMonitor,
            A_ServerProxy,
            A_StaticLoader,
            A_ServerCORS,
            A_ListingController,
            UserController,
            ProductController,
            UserRepository
        ],
        entities: [
            User,
            Product
        ],
        fragments: [config]
    });

    // Main concept
    const concept = new A_Concept({
        name: 'my-complete-server',
        containers: [SharedConfig, Server],
        components: [A_Polyfill],
        fragments: [
            config,
            new A_ProxyConfig({
                '/api/external': 'https://api.external-service.com',
                '/assets/.*': 'https://cdn.example.com'
            }),
            new A_StaticConfig(['public', 'docs'])
        ],
        entities: [User, Product]
    });

    await concept.load();
    await concept.start();
    
    console.log(`🚀 Server running on port ${config.get('A_SERVER_PORT')}`);
    console.log(`📊 Health check available at /health`);
    console.log(`📁 Static files served from /public and /docs`);
})();
```

## API Reference

### Core Exports

- **Containers**: `A_Service`
- **Contexts**: `A_Server`, `A_ProxyConfig`, `A_StaticConfig`, `A_ListQueryFilter`
- **Entities**: `A_Request`, `A_Response`, `A_Route`, `A_EntityList`
- **Components**: `A_ServerLogger`, `A_EntityController`, `A_Router`, `A_ServerHealthMonitor`, `A_ServerProxy`, `A_ServerCORS`, `A_StaticLoader`, `A_Controller`, `A_ListingController`

### Environment Variables Reference

```bash
# Server Configuration
A_SERVER_PORT=3000

# Router Configuration
A_ROUTER__PARSE_PARAMS_AUTOMATICALLY=true

# Development Configuration
CONFIG_VERBOSE=true
DEV_MODE=true
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📚 [Documentation](https://docs.adaas.org)
- 🐛 [Issue Tracker](https://github.com/ADAAS-org/adaas-a-server/issues)
- 💬 [Community Discord](https://discord.gg/adaas)
- 📧 [Email Support](mailto:support@adaas.org)
```

