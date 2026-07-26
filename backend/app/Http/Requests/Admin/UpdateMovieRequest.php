<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'integer', 'min:1', 'max:500'],
            'description' => ['required', 'string'],
            'country' => ['required', 'string', 'max:255'],
        ];
    }
}
