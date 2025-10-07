# Contributing to Local TCG Marketplace

Thank you for your interest in contributing to Local TCG Marketplace! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/local-tcg-marketplace.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Test your changes: `npm run test`
7. Lint your code: `npm run lint`
8. Format your code: `npm run format`
9. Commit your changes: `git commit -m "Add your message"`
10. Push to your fork: `git push origin feature/your-feature-name`
11. Create a Pull Request

## Code Style

- We use TypeScript for all code
- Follow the existing code style
- Use Prettier for formatting (configured in `.prettierrc`)
- Use ESLint for linting
- Write meaningful commit messages

## Pull Request Process

1. Ensure your code builds and tests pass
2. Update documentation if needed
3. Add tests for new features
4. Follow the existing code structure
5. Request review from maintainers

## Reporting Bugs

Use GitHub Issues to report bugs. Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the feature clearly
- Explain why it would be useful
- Provide examples if possible

## Development Guidelines

### Backend Development

- Follow RESTful API conventions
- Add proper error handling
- Document new endpoints
- Write tests for new features
- Use TypeScript types from `@local-tcg/shared`

### Frontend Development

- Keep components small and focused
- Use TypeScript interfaces
- Follow React best practices
- Ensure responsive design
- Test on multiple browsers

### Database Changes

- Document schema changes
- Provide migration scripts if needed
- Test with sample data

## Questions?

Feel free to open an issue or discussion if you have questions!
