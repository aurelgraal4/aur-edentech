type Props = {
        title: string
        }

        export default function Topbar({ title }: Props) {
          return (
              <div
                    style={{
                            padding: 20,
                                    borderBottom: "1px solid #222",
                                            fontSize: 22,
                                                    fontWeight: 600,
                                                            color: "#00ffae"
                                                                  }}
                                                                      >
                                                                            {title}
                                                                                </div>
                                                                                  )
                                                                                  }