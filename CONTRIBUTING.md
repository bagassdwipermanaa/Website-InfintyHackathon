# Contributing to BlockRights

Thank you for your interest in contributing to BlockRights! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git
- Basic knowledge of React, Next.js, Express.js, and blockchain concepts

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/blockrights.git
   cd blockrights
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Setup Environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Setup Database**
   ```bash
   npm run db:init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Contribution Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports**: Report bugs and issues
- **Feature Requests**: Suggest new features
- **Code Contributions**: Submit code improvements
- **Documentation**: Improve documentation
- **Testing**: Add or improve tests
- **Design**: UI/UX improvements

### Reporting Issues

When reporting issues, please include:

1. **Clear Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Environment**: OS, Node.js version, browser version
4. **Screenshots**: If applicable
5. **Error Messages**: Full error messages and stack traces

### Feature Requests

When requesting features:

1. **Clear Description**: What feature you want and why
2. **Use Cases**: How would this feature be used?
3. **Mockups**: If applicable, include mockups or wireframes
4. **Implementation Ideas**: Any ideas on how to implement

### Code Contributions

#### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `docs/documentation-update` - Documentation updates
- `refactor/refactor-description` - Code refactoring

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(auth): add wallet-based authentication
fix(upload): resolve file size validation issue
docs(api): update authentication endpoints
```

#### Pull Request Process

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation if needed
   - Follow existing code style

3. **Test Changes**
   ```bash
   npm run lint
   npm run test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request reviews from maintainers

### Code Style Guidelines

#### Frontend (React/Next.js)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use Tailwind CSS for styling
- Follow Next.js conventions

#### Backend (Express.js)
- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for common functionality
- Follow RESTful API conventions
- Validate all inputs
- Use proper HTTP status codes

#### Database (Sequelize)
- Use migrations for schema changes
- Implement proper relationships
- Add appropriate indexes
- Use transactions for complex operations
- Validate data at model level

#### General
- Write self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle

### Testing Guidelines

#### Frontend Testing
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths
- Test accessibility features

#### Backend Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Database tests for models
- Error handling tests

#### Test Structure
```javascript
describe('Component/Function Name', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

### Documentation Guidelines

#### Code Documentation
- Document complex functions
- Add JSDoc comments for public APIs
- Include examples in documentation
- Keep documentation up to date

#### API Documentation
- Document all endpoints
- Include request/response examples
- Document error responses
- Keep API docs synchronized with code

#### User Documentation
- Write clear, concise instructions
- Include screenshots when helpful
- Provide troubleshooting guides
- Keep documentation current

### Review Process

#### For Contributors
1. Ensure all tests pass
2. Follow code style guidelines
3. Add/update tests for new features
4. Update documentation
5. Respond to review feedback promptly

#### For Reviewers
1. Check code quality and style
2. Verify tests are adequate
3. Test functionality manually
4. Check security implications
5. Provide constructive feedback

### Security Considerations

- Never commit sensitive information (passwords, keys, tokens)
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication/authorization
- Follow security best practices
- Report security vulnerabilities privately

### Performance Considerations

- Optimize database queries
- Implement proper caching
- Minimize bundle sizes
- Use lazy loading where appropriate
- Monitor performance metrics
- Profile and optimize bottlenecks

## Development Workflow

### Daily Development
1. Pull latest changes from main branch
2. Create feature branch
3. Make changes and test locally
4. Commit with descriptive messages
5. Push and create pull request

### Release Process
1. Update version numbers
2. Update changelog
3. Create release notes
4. Tag release
5. Deploy to production

## Getting Help

- **Documentation**: Check the docs/ directory
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our Discord server (if available)
- **Email**: Contact maintainers directly

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Social media acknowledgments

## License

By contributing to BlockRights, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:
1. Check this document first
2. Search existing issues
3. Create a new issue with the "question" label
4. Contact the maintainers

Thank you for contributing to BlockRights! 🚀
