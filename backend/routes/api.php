<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TicketTypeController;
use Illuminate\Support\Facades\Route;

// --- Public ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);

// --- Authenticated (any logged-in user) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

    // --- Organizer + Admin: manage events ---
    Route::middleware('role:organizer,admin')->group(function () {
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::patch('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);

        Route::post('/events/{event}/ticket-types', [TicketTypeController::class, 'store']);
        Route::put('/events/{event}/ticket-types/{ticketType}', [TicketTypeController::class, 'update']);
        Route::delete('/events/{event}/ticket-types/{ticketType}', [TicketTypeController::class, 'destroy']);
    });

    // --- Admin only ---
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/users', [DashboardController::class, 'users']);
        Route::patch('/users/{user}/role', [DashboardController::class, 'updateUserRole']);
    });
});
