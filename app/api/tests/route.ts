import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { variant, scenario } = await request.json()

    // Trigger JMeter test via shell script
    const jmeterPath = process.env.JMETER_HOME || "./jmeter"
    const testFile = `./jmeter/scenarios/${scenario}.jmx`
    const port = variant === "C" ? 8080 : 8081

    const command = `${jmeterPath}/bin/jmeter.sh -n -t ${testFile} -l results.jtl -Djavax.net.debug=ssl -Djava.rmi.server.hostname=127.0.0.1 -p http.port=${port}`

    console.log("[v0] Running JMeter test:", command)

    // Execute in background
    exec(command, (error, stdout, stderr) => {
      if (error) console.error("[v0] JMeter error:", error)
      if (stderr) console.error("[v0] JMeter stderr:", stderr)
      console.log("[v0] JMeter output:", stdout)
    })

    return NextResponse.json({
      status: "started",
      scenario,
      variant,
      message: "Load test started. Monitor progress in Grafana.",
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    scenarios: ["read-heavy", "join-filter", "mixed", "heavy-body"],
    status: "ready",
  })
}
