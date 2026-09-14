# Sales Dashboard - Real-Time Salesforce Analytics

A sophisticated real-time dashboard powered by GitHub Copilot and Salesforce integration via MCP (Model Context Protocol) server, providing actionable insights into deals, contacts, opportunities, and accounts.

## 🎯 Project Overview

This project creates a unified analytics platform that:
- **Real-Time Data Sync**: Continuous integration with Salesforce via MCP server
- **Actionable Intelligence**: Transform raw CRM data into business insights
- **GitHub Copilot Integration**: AI-powered analysis and recommendations
- **Live Visibility**: Monitor deals, contacts, and pipeline metrics as they change

### Key Benefits
- 📊 Real-time dashboard updates without manual refresh
- 🤖 Copilot-powered analytics and predictive insights
- 📈 Comprehensive sales pipeline visibility
- 🔍 Deal health monitoring and risk identification
- 👥 Contact relationship tracking and engagement insights
- ⚡ Performance optimization with caching and incremental updates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Copilot                           │
│             (AI Analysis & Recommendations)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  MCP Server (Core)                          │
│            (Salesforce Data Integration)                    │
└──────────┬──────────────────────┬──────────────────────────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │   Backend   │        │  Real-Time  │
    │   API       │        │  WebSocket  │
    │   (Flask)   │        │  Manager    │
    └──────┬──────┘        └──────┬──────┘
           │                      │
    ┌──────▼──────────────────────▼──────┐
    │   Salesforce API (REST + Bulk)     │
    │   - Accounts, Opportunities        │
    │   - Contacts, Deals, Activities    │
    │   - Custom Objects                 │
    └──────┬───────────────────────────┬─┘
           │                           │
    ┌──────▼──────┐          ┌─────────▼──────┐
    │   Cache     │          │   Database     │
    │  (Redis)    │          │  (PostgreSQL)  │
    └─────────────┘          └────────────────┘
           │                           │
    ┌──────▼─────────────────────────▼──────┐
    │      Frontend Dashboard (React)       │
    │  - Real-time Charts & Metrics         │
    │  - Deal Pipeline & Forecasting        │
    │  - Contact & Activity Tracking        │
    └───────────────────────────────────────┘
```

## 📁 Project Structure

```
Sales_Dashboard/
├── backend/
│   ├── app.py                      # Flask application entry point
│   ├── config.py                   # Configuration management
│   ├── requirements.txt            # Python dependencies
│   ├── mcp_server/
│   │   ├── __init__.py
│   │   ├── salesforce_mcp.py       # MCP Salesforce integration
│   │   ├── tools.py                # MCP tool definitions
│   │   └── handlers.py             # Request handlers
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py               # REST API endpoints
│   │   ├── auth.py                 # Authentication & authorization
│   │   └── decorators.py           # Custom decorators
│   ├── services/
│   │   ├── __init__.py
│   │   ├── salesforce_service.py   # Salesforce API client
│   │   ├── cache_service.py        # Redis caching layer
│   │   ├── analytics_service.py    # Data analysis & metrics
│   │   ├── copilot_service.py      # GitHub Copilot integration
│   │   └── websocket_service.py    # Real-time updates
│   ├── models/
│   │   ├── __init__.py
│   │   ├── schemas.py              # Pydantic/Marshmallow schemas
│   │   └── database.py             # ORM models
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py               # Logging configuration
│   │   ├── validators.py           # Data validation
│   │   └── helpers.py              # Utility functions
│   └── tests/
│       ├── __init__.py
│       ├── test_salesforce_service.py
│       ├── test_api_routes.py
│       ├── test_mcp_server.py
│       └── conftest.py
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Main dashboard component
│   │   │   ├── DealPipeline.jsx    # Deal visualization
│   │   │   ├── ContactList.jsx     # Contact management
│   │   │   ├── MetricsCard.jsx     # KPI cards
│   │   │   ├── RealTimeChart.jsx   # Live updating charts
│   │   │   └── CopilotInsights.jsx # AI insights panel
│   │   ├── services/
│   │   │   ├── apiClient.js        # API communication
│   │   │   └── websocketClient.js  # WebSocket connection
│   │   ├── hooks/
│   │   │   ├── useRealtimeData.js  # Real-time data hook
│   │   │   ├── useSalesforce.js    # Salesforce API hook
│   │   │   └── useCopilot.js       # Copilot integration hook
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── dashboard.css
│   │   │   └── charts.css
│   │   └── utils/
│   │       ├── formatters.js
│   │       └── constants.js
│   └── vite.config.js
├── config/
│   ├── salesforce.config.json      # Salesforce configuration
│   ├── mcp.config.json             # MCP server configuration
│   ├── database.config.json        # Database configuration
│   └── .env.example                # Environment variables template
├── docs/
│   ├── ARCHITECTURE.md             # System architecture
│   ├── API.md                      # API documentation
│   ├── MCP_INTEGRATION.md          # MCP setup guide
│   ├── SETUP.md                    # Installation & setup
│   ├── DEPLOYMENT.md               # Deployment guide
│   └── TROUBLESHOOTING.md          # Common issues
├── scripts/
│   ├── setup.sh                    # Setup script
│   ├── migrate_db.py               # Database migrations
│   ├── seed_data.py                # Sample data
│   └── sync_salesforce.py          # Manual sync script
├── docker/
│   ├── Dockerfile.backend          # Backend container
│   ├── Dockerfile.frontend         # Frontend container
│   ├── Dockerfile.mcp              # MCP server container
│   └── docker-compose.yml          # Multi-service orchestration
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI/CD pipeline
│       └── deploy.yml              # Deployment workflow
├── .env.example                    # Environment template
├── .gitignore
└── LICENSE
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Redis (for caching)
- PostgreSQL (for persistence)
- Salesforce account with API access
- GitHub account for Copilot integration

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Yash705-bit/Sales_Dashboard.git
cd Sales_Dashboard
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Salesforce and GitHub credentials
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

5. **Initialize database**
```bash
cd ../backend
python scripts/migrate_db.py
python scripts/seed_data.py
```

6. **Start services**
```bash
# Terminal 1: Backend API
cd backend
python app.py

# Terminal 2: MCP Server
python mcp_server/salesforce_mcp.py

# Terminal 3: Frontend
cd ../frontend
npm run dev
```

7. **Access dashboard**
Open http://localhost:3000 in your browser

## 📊 Core Features

### Real-Time Data Sync
- WebSocket-based live updates from Salesforce
- Configurable sync intervals (1s - 1hr)
- Change detection and delta sync

### Sales Pipeline Analytics
- Visual deal pipeline with drag-and-drop stages
- Win/loss probability forecasting
- Pipeline velocity and conversion metrics

### Contact Management
- Centralized contact directory with engagement history
- Activity timeline and communication history
- Contact relationship mapping

### Advanced Metrics
- Revenue forecasting with Copilot AI
- Deal health scoring
- Sales rep performance analytics
- Territory management

### Copilot Integration
- Intelligent deal recommendations
- Risk identification and alerts
- Natural language queries via Copilot
- Predictive analytics and insights

## 🔧 Configuration

### Salesforce Setup

1. Create a Connected App in Salesforce:
   - Go to Setup → Apps → App Manager
   - Create new Connected App
   - Enable OAuth flows and set scopes

2. Generate Salesforce credentials:
   - Client ID and Secret (add to .env)
   - Create a dedicated API user

3. Configure MCP server (config/mcp.config.json):
```json
{
  "salesforce": {
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "username": "api_user@company.com",
    "password": "YOUR_PASSWORD",
    "security_token": "YOUR_SECURITY_TOKEN",
    "instance_url": "https://your-instance.salesforce.com",
    "api_version": "v60.0"
  },
  "mcp": {
    "port": 3001,
    "host": "localhost",
    "sync_interval": 300,
    "cache_ttl": 3600
  }
}
```

### GitHub Copilot Setup

1. Enable Copilot in your GitHub account
2. Get API credentials from https://github.com/settings/copilot
3. Update .env:
```bash
GITHUB_COPILOT_API_KEY=your_api_key
COPILOT_MODEL=gpt-4-turbo
```

## 🤖 MCP Server Deep Dive

The Model Context Protocol (MCP) server enables seamless communication between Copilot and Salesforce:

**Key Tools:**
- `query_salesforce` - Execute SOQL queries
- `get_deal_details` - Retrieve opportunity details
- `get_contact_info` - Fetch contact information
- `update_record` - Modify Salesforce records
- `analyze_pipeline` - Get pipeline analytics
- `forecast_revenue` - Revenue prediction

See [MCP_INTEGRATION.md](docs/MCP_INTEGRATION.md) for detailed documentation.

## 📡 API Endpoints

```
GET  /api/dashboard           - Dashboard overview data
GET  /api/deals               - List all deals with filters
GET  /api/deals/:id           - Deal details
PUT  /api/deals/:id           - Update deal
GET  /api/contacts            - List all contacts
GET  /api/contacts/:id        - Contact details
GET  /api/analytics/pipeline  - Pipeline analytics
GET  /api/analytics/forecast  - Revenue forecast
POST /api/copilot/query       - Copilot AI queries
WS   /ws/realtime             - WebSocket for live updates
```

See [API.md](docs/API.md) for complete documentation.

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

Services will be available at:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- MCP Server: http://localhost:3001

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [MCP Integration](docs/MCP_INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🔒 Security

- OAuth 2.0 for Salesforce authentication
- JWT tokens for API authentication
- Redis-based session management
- Encrypted credential storage
- Rate limiting and DDoS protection
- Comprehensive audit logging

## 📈 Performance

- Real-time updates via WebSocket
- Redis caching for frequently accessed data
- Database query optimization
- Incremental sync strategy
- CDN delivery for frontend assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check docs/ folder for guides
- **Examples**: See backend/tests/ for integration examples

## 🎯 Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Advanced forecasting with ML
- [ ] Integration with Slack/Teams
- [ ] Custom field management
- [ ] Multi-language support
- [ ] Offline mode with sync
- [ ] Advanced reporting engine

---

**Last Updated**: September 14, 2026
**Version**: 1.0.0-beta
