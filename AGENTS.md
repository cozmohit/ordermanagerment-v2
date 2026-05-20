# Repository Guidelines

## Project Structure & Module Organization
This repository is an Angular 19 application. Core app code lives under `src/app`, with shared layout components in `src/app/layout` (`sidebar`, `top-nav`, `footer`), route-level pages in `src/app/pages`, and app-wide services in `src/app/services`. Global styles live in `src/styles.scss` and `src/styles/_shared-ui.scss`. Static assets belong in `public/`. Keep new feature files grouped by page or component folder and follow Angular's `.component.ts/.html/.scss/.spec.ts` pattern.

## Build, Test, and Development Commands
Use `npm install` to restore dependencies. Run `npm start` to launch the Angular dev server at `http://localhost:4200/`. Use `npm run build` for a production build into `dist/`. Use `npm run watch` during UI work when you want rebuilds without serving. Run `npm test` to execute unit tests through Karma and Jasmine.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, spaces, 2-space indentation, and trailing newline. TypeScript uses single quotes. Prefer Angular standalone component conventions already used in `src/app`. Name components and folders in kebab-case, classes in PascalCase, properties and methods in camelCase, and keep one primary responsibility per component or service.

## Testing Guidelines
Unit tests use Jasmine with Karma via `*.spec.ts` files next to the implementation. Add or update tests for component behavior, routing changes, and service logic whenever you change them. Keep test names descriptive, for example `should render order summary cards`. Run `npm test` before opening a PR; there is no separate e2e setup in this repository today.

## Commit & Pull Request Guidelines
The current history is minimal (`Initial commit`, `First Commit`), so adopt clear imperative commit subjects such as `Add provider network filters` or `Fix sidebar route highlighting`. Keep commits focused. PRs should include a short summary, affected screens or modules, linked issue or ticket if available, and screenshots for visible UI changes.

## Configuration Notes
Do not commit `node_modules/` or build output. Prefer configuration changes through `angular.json`, `tsconfig*.json`, or environment-specific Angular patterns instead of hardcoded values in components.
