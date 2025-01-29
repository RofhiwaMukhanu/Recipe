from flask import Flask, render_template, request, jsonify
import psycopg2

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'Recipe',
    'user': 'postgres',
    'password': 'Rofhiwa@23'
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

@app.route('/')
def index():
    return render_template('index.html')

# CRUD API Endpoints

@app.route('/recipes', methods=['GET'])
def get_recipes():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM recipes ORDER BY id DESC')
    recipes = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{'id': r[0], 'title': r[1], 'ingredients': r[2], 'instructions': r[3]} for r in recipes])

@app.route('/recipes', methods=['POST'])
def add_recipe():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO recipes (title, ingredients, instructions) VALUES (%s, %s, %s) RETURNING id',
        (data['title'], data['ingredients'], data['instructions'])
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': new_id, 'message': 'Recipe added successfully!'})

@app.route('/recipes/<int:id>', methods=['PUT'])
def update_recipe(id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE recipes SET title = %s, ingredients = %s, instructions = %s WHERE id = %s',
        (data['title'], data['ingredients'], data['instructions'], id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Recipe updated successfully!'})

@app.route('/recipes/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM recipes WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Recipe deleted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)