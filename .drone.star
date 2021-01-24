def main(ctx):
    if ctx.build.event == "cron":
        return pipeline("cron")
    else:
        return pipeline("push")

def pipeline(kind):
    return {
        "kind": "pipeline",
        "type": "docker",
        "name": "tracerBullets %s" % kind,
        "platform": {
            "arch": "arm64"
        },
        "concurrency": {
           "limit": 1
        },
        "steps": [
            {
                "name": "yarn install",
                "pull": "if-not-exists",
                "image": "arm64v8/node:14.15-alpine",
                "commands": [
                    "yarn install --pure-lockfile"
                ]
            },
            {
                "name": "thumbnail tracerBullet",
                "pull": "if-not-exists",
                "image": "arm64v8/node:14.15-alpine",
                "environment": {
                    "STACKROCK_API_KEY": {
                        "from_secret": "STACKROCK_API_KEY"
                    },
                    "BUCKET": {
                        "from_secret": "BUCKET"
                    },
                    "AWS_REGION": {
                        "from_secret": "AWS_REGION"
                    },
                    "AWS_ACCESS_KEY_ID": {
                        "from_secret": "AWS_ACCESS_KEY_ID"
                    },
                    "AWS_SECRET_ACCESS_KEY": {
                        "from_secret": "AWS_SECRET_ACCESS_KEY"
                    },
                    "INPUT_KEY": {
                        "from_secret": "THUMBNAIL_INPUT_KEY"
                    },
                    "OUTPUT_KEY": {
                        "from_secret": "THUMBNAIL_OUTPUT_KEY"
                    }
                },
                "depends_on": [
                    "yarn install"
                ],
                "commands": [
                    "./node_modules/.bin/ts-node tracerBullet/thumbnail.ts"
                ]
            },
            {
                "name": "summary tracerBullet",
                "pull": "if-not-exists",
                "image": "arm64v8/node:14.15-alpine",
                "environment": {
                    "STACKROCK_API_KEY": {
                        "from_secret": "STACKROCK_API_KEY"
                    },
                    "BUCKET": {
                        "from_secret": "BUCKET"
                    },
                    "AWS_REGION": {
                        "from_secret": "AWS_REGION"
                    },
                    "AWS_ACCESS_KEY_ID": {
                        "from_secret": "AWS_ACCESS_KEY_ID"
                    },
                    "AWS_SECRET_ACCESS_KEY": {
                        "from_secret": "AWS_SECRET_ACCESS_KEY"
                    },
                    "INPUT_KEY": {
                        "from_secret": "SUMMARY_INPUT_KEY"
                    },
                    "OUTPUT_KEY": {
                        "from_secret": "SUMMARY_OUTPUT_KEY"
                    }
                },
                "depends_on": [
                    "yarn install"
                ],
                "commands": [
                    "./node_modules/.bin/ts-node tracerBullet/summary.ts"
                ]
            },
            {
                "name": "transcode tracerBullet",
                "pull": "if-not-exists",
                "image": "arm64v8/node:14.15-alpine",
                "environment": {
                    "STACKROCK_API_KEY": {
                        "from_secret": "STACKROCK_API_KEY"
                    },
                    "BUCKET": {
                        "from_secret": "BUCKET"
                    },
                    "AWS_REGION": {
                        "from_secret": "AWS_REGION"
                    },
                    "AWS_ACCESS_KEY_ID": {
                        "from_secret": "AWS_ACCESS_KEY_ID"
                    },
                    "AWS_SECRET_ACCESS_KEY": {
                        "from_secret": "AWS_SECRET_ACCESS_KEY"
                    },
                    "INPUT_KEY": {
                        "from_secret": "TRANSCODE_INPUT_KEY"
                    },
                    "OUTPUT_KEY": {
                        "from_secret": "TRANSCODE_OUTPUT_KEY"
                    }
                },
                "depends_on": [
                    "yarn install"
                ],
                "commands": [
                    "./node_modules/.bin/ts-node tracerBullet/transcode.ts"
                ]
            },
            {
                "name": "slack",
                "image": "plugins/slack",
                "pull": "if-not-exists",
                "settings": {
                    "webhook": {
                        "from_secret": "SLACK_WEBHOOK"
                    },
                    "channel": {
                        "from_secret": "SLACK_CHANNEL"
                    }
                },
                "when": {
                    "status": ["success", "failure"]
                },
                "depends_on": [
                    "summary tracerBullet",
                    "transcode tracerBullet",
                    "thumbnail tracerBullet"
                ]
            }
        ]
    }

def trigger(kind):
    if kind == "cron":
        return {
           "branch": ["master"],
           "event": ["cron"],
           "cron": ["hourly"]
        }
    else:
        return {
           "branch": ["master"],
        }