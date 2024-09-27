

# Build the application
all: build

build:
	@echo "Building..."
	@tailwindcss -i src/webview/input.css -o out/react/output.css
	@pnpm run esbuild:analyze

# Run the application
run:
	@pnpm run esbuild:watch

# Test the application
test:
	@echo "Testing..."
	@pnpm run test

# Clean the binary
clean:
	@echo "Cleaning..."
	@pnpm run clean

# Live Reload
watch:
	@pnpm run esbuild:watch &
	@tailwindcss -i ./src/webview/input.css -o ./out/react/output.css --config ./src/webview/tailwind.config.js --watch

.PHONY: all build run test clean