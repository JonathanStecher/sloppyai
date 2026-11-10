"""Intentional source-review fixture. Do not run or copy into production.

The scanner should ask for trust-boundary evidence, not claim a demonstrated exploit.
"""

import subprocess


def candidate_shell_boundary(command):
    return subprocess.run(command, shell=True, check=True)


def candidate_query_boundary(connection, name):
    return connection.execute(f"SELECT * FROM reports WHERE name = '{name}'")
