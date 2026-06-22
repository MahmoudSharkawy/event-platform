<?php

use Illuminate\Support\Facades\Route;

// This is an API-only application; the React frontend is served separately
// (e.g. via Vite dev server or its own static hosting). This route just
// confirms the backend is reachable when visited directly in a browser.
Route::get('/', function () {
    return response()->json(['message' => 'Event Ticketing API is running.']);
});
